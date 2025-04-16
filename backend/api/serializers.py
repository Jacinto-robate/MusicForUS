# api/serializers.py
from rest_framework import serializers
from .models import Artist, Album, Song

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['id', 'name', 'image', 'description']




class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.name', read_only=True)  # Adiciona o nome do artista
    

    class Meta:
        model = Album
        fields = ['id', 'title', 'artist', 'cover_image', 'release_date', 'artist_name']  # Inclui o novo campo





class SongSerializer(serializers.ModelSerializer):
    album_cover = serializers.ImageField(source='album.cover_image', read_only=True)  # Capa do álbum
    cover_image = serializers.ImageField(required=False)  # Adiciona a capa da música, se houver

    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'album', 'duration', 'release_date', 'audio_file', 'album_cover', 'cover_image', 'lyrics']  # Inclui 'lyrics'


        