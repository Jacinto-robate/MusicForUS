from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Artist, Album, Song
from .serializers import ArtistSerializer, AlbumSerializer, SongSerializer
from rest_framework import generics

@csrf_exempt
def add_artist(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        description = request.POST.get('description')
        image_file = request.FILES.get('image')

        # Salvar o arquivo de imagem
        if image_file:
            # Salvar a imagem usando o armazenamento padrão do Django
            artist = Artist(name=name, description=description)
            artist.image.save(image_file.name, image_file)
            artist.save()

            # Obter a URL da imagem armazenada
            file_url = artist.image.url

            return JsonResponse({
                'id': artist.id,
                'name': artist.name,
                'image': file_url,  # Use a URL correta da imagem
                'description': artist.description,
            }, status=201)
        return JsonResponse({'error': 'Image upload failed'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=400)

@api_view(['GET'])
def artist_list(request):
    if request.method == 'GET':
        artists = Artist.objects.all()
        serializer = ArtistSerializer(artists, many=True)
        return Response(serializer.data)


from .models import Album
from .serializers import AlbumSerializer



@api_view(['GET'])
def album_list(request):
    if request.method == 'GET':
        albums = Album.objects.all()
        serializer = AlbumSerializer(albums, many=True)
        return Response(serializer.data)

@csrf_exempt
def add_album(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        artist_id = request.POST.get('artist')  # Certifique-se de que o artista existe
        release_date = request.POST.get('release_date')
        cover_image_file = request.FILES.get('cover_image')

        # Verifique se o artista existe
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return JsonResponse({'error': 'Artist does not exist'}, status=404)

        # Salvar o álbum
        if cover_image_file:
            album = Album(title=title, artist=artist, release_date=release_date)
            album.cover_image.save(cover_image_file.name, cover_image_file)
            album.save()

            # Obter a URL da imagem armazenada
            cover_image_url = album.cover_image.url

            return JsonResponse({
                'id': album.id,
                'title': album.title,
                'artist': artist.name,
                'cover_image': cover_image_url,
                'release_date': album.release_date,
            }, status=201)
        return JsonResponse({'error': 'Cover image upload failed'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=400)


from .models import Song
from .serializers import SongSerializer

@api_view(['GET'])
def artist_songs(request, artist_id):
    try:
        songs = Song.objects.filter(artist_id=artist_id)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    except Artist.DoesNotExist:
        return Response({"error": "Artist not found"}, status=status.HTTP_404_NOT_FOUND)


from rest_framework import generics
from .models import Artist
from .serializers import ArtistSerializer

class ArtistDetailView(generics.RetrieveAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    lookup_field = 'pk'  # Utilize 'pk' como padrão


@api_view(['GET'])
def album_songs(request, album_id):
    try:
        album = Album.objects.get(id=album_id)
        songs = Song.objects.filter(album=album)
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Album.DoesNotExist:
        return Response({"error": "Album not found"}, status=status.HTTP_404_NOT_FOUND)


class AlbumDetailView(generics.RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer
    lookup_field = 'id'  # Correto


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Song
from .serializers import SongSerializer

class SongDetailView(APIView):
    def get(self, request, id):
        try:
            song = Song.objects.get(id=id)
            serializer = SongSerializer(song)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)





@csrf_exempt
def add_song(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        artist_id = request.POST.get('artist')
        album_id = request.POST.get('album')
        duration = request.POST.get('duration')
        release_date = request.POST.get('release_date')
        audio_file = request.FILES.get('audio_file')
        cover_image_file = request.FILES.get('cover_image')
        lyrics = request.POST.get('lyrics')  # Obtenha a letra da música

        # Verifique se o artista e o álbum existem
        try:
            artist = Artist.objects.get(id=artist_id)
        except Artist.DoesNotExist:
            return JsonResponse({'error': 'Artist does not exist'}, status=404)

        try:
            album = Album.objects.get(id=album_id)
        except Album.DoesNotExist:
            return JsonResponse({'error': 'Album does not exist'}, status=404)

        # Criar a música
        song = Song(
            title=title,
            artist=artist,
            album=album,
            duration=duration,
            release_date=release_date,
            audio_file=audio_file,
            cover_image=cover_image_file,
            lyrics=lyrics  # Adicionando a letra
        )
        song.save()

        return JsonResponse({
            'id': song.id,
            'title': song.title,
            'artist': artist.name,
            'album': album.title,
            'release_date': song.release_date,
            'audio_file': song.audio_file.url,
            'album_cover': song.album.cover_image.url if song.album else None,
            'cover_image': song.cover_image.url if song.cover_image else None,
            'lyrics': song.lyrics,  # Retornar a letra da música
        }, status=201)

    return JsonResponse({'error': 'Invalid method'}, status=400)
