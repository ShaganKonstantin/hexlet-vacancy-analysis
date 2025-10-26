from django.urls import path

from . import views

urlpatterns = [
    # path('', views.RegionsListView.as_view(), name='regions_list'),
    path('<str:city_name>/', views.RegionView.as_view(), name='region_page'),
    # path('<str:region_id>', views.RegionView.as_view(), name='region_page'),
]