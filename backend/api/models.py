# models.py
from django.utils.timezone import now
from django.db import models

class Artist(models.Model):
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='artists/')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Album(models.Model):
    title = models.CharField(max_length=100)
    artist = models.ForeignKey(Artist, related_name='albums', on_delete=models.CASCADE)
    cover_image = models.ImageField(upload_to='albums/')
    release_date = models.DateField()

    def __str__(self):
        return self.title



# models.py
class Song(models.Model):
    title = models.CharField(max_length=255)
    artist = models.ForeignKey(Artist, related_name='songs', on_delete=models.CASCADE)
    album = models.ForeignKey(Album, related_name='songs', on_delete=models.SET_NULL, null=True, blank=True)
    duration = models.DurationField()
    release_date = models.DateField(default=now)  
    audio_file = models.FileField(upload_to='songs/', blank=True, null=True)  # Arquivo de áudio
    cover_image = models.ImageField(upload_to='songs/covers/', blank=True, null=True)  # Nova imagem de capa para a música
    lyrics = models.TextField(blank=True, null=True)  # Adicionado o campo para a letra da música

    def __str__(self):
        return self.title


