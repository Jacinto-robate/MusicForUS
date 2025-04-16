from django.urls import path
from .views import artist_list, add_artist, add_album, album_list, artist_songs, ArtistDetailView, album_songs, AlbumDetailView
from .views import SongDetailView  # Importe a view que lida com os detalhes da música



urlpatterns = [
    path('artists/', artist_list, name='artist_list'),
    path('artists/add/', add_artist, name='add_artist'),
    path('albums/', album_list, name='album_list'),
    path('albums/add/', add_album, name='add_album'),
    path('artists/<int:pk>/', ArtistDetailView.as_view(), name='artist_detail'),  
    path('artists/<int:artist_id>/songs/', artist_songs, name='artist_songs'),
    path('albums/<int:id>/', AlbumDetailView.as_view(), name='album_detail'),  # Alterar para 'id'
    path('albums/<int:album_id>/songs/', album_songs, name='album_songs'),  # Músicas do álbum
    # Endpoint para detalhes de músicas
    path('songs/<int:id>/', SongDetailView.as_view(), name='song_detail'),  # Adicione essa linha
]
