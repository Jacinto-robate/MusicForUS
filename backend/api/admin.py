# admin.py
from django.contrib import admin
from .models import Artist, Album, Song
from django.utils.html import mark_safe

class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image_preview')
    search_fields = ('name',)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" />')
        return '-'
    image_preview.short_description = 'Image Preview'

class AlbumAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'release_date', 'cover_image_preview')
    list_filter = ('artist',)
    search_fields = ('title',)

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return mark_safe(f'<img src="{obj.cover_image.url}" width="50" height="50" />')
        return '-'
    cover_image_preview.short_description = 'Cover Image Preview'

class SongAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'album', 'duration', 'release_date', 'audio_file', 'cover_image_preview', 'lyrics_preview')
    list_filter = ('artist', 'album')
    search_fields = ('title', 'artist__name', 'album__title')

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return mark_safe(f'<img src="{obj.cover_image.url}" width="50" height="50" />')
        return '-'
    cover_image_preview.short_description = 'Cover Image Preview'

    def lyrics_preview(self, obj):
        if obj.lyrics:
            return mark_safe(f'<span>{obj.lyrics[:50]}...</span>')  # Exibe um preview das primeiras 50 letras
        return '-'
    lyrics_preview.short_description = 'Lyrics Preview'

    # Adiciona o campo 'lyrics' no formulário de edição do Song
    fields = ('title', 'artist', 'album', 'duration', 'release_date', 'audio_file', 'cover_image', 'lyrics')

# Registrando os modelos com suas respectivas classes de administração
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Album, AlbumAdmin)
admin.site.register(Song, SongAdmin)

# Personalizando o cabeçalho e o título do painel de administração
from django.utils.translation import gettext_lazy as _

admin.site.site_header = _("ForUS")
admin.site.site_title = _("Título do Painel de Admin")
admin.site.index_title = _("Bem-vindo ao painel de administração")
