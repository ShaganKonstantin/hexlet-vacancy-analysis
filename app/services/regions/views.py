from django.shortcuts import get_object_or_404
from django.core.paginator import Paginator
from django.views import View

from inertia import render as inertia_render
from app.services.parser.models import HhVacancy, SuperjobVacancy
from .models import Region


# class RegionsListView(View):
#     def get(self, request):
#         regions = Region.objects.all().values('id', 'name', 'code')
#         props = {
#             'regions': list(regions),
#         }
#         return inertia_render(request, 'RegionsListPage', props)

# class RegionView(View):

#     ###
#     def get(self, request, region_id):
#         print(f"=== DEBUG: Requested region_id: {region_id} ===")
        
#         region = get_object_or_404(Region, code=region_id)
#         print(f"=== DEBUG: Found region - ID: {region.id}, Name: '{region.name}', Code: '{region.code}' ===")
        
#         hh_vacancies = HhVacancy.objects.filter(region=region.name)
#         sj_vacancies = SuperjobVacancy.objects.filter(region=region.name)
        
#         print(f"=== DEBUG: HH vacancies count: {hh_vacancies.count()} ===")
#         print(f"=== DEBUG: SJ vacancies count: {sj_vacancies.count()} ===")
        
#         # Выведите несколько примеров регионов из вакансий для сравнения
#         sample_hh_regions = HhVacancy.objects.values_list('region', flat=True).distinct()[:5]
#         print(f"=== DEBUG: Sample HH regions in DB: {list(sample_hh_regions)} ===")
#     ###
#     def get(self, request, region_id):
#         region = get_object_or_404(Region, code=region_id)

#         hh_vacancies = HhVacancy.objects.filter(region=region.name)
#         sj_vacancies = SuperjobVacancy.objects.filter(region=region.name)
#         all_vacancies = list(hh_vacancies) + list(sj_vacancies)

#         paginator = Paginator(all_vacancies, 25)
#         page_number = request.GET.get("page")
#         page_obj = paginator.get_page(page_number)

#         vacancies_data = [
#             {
#                 # "id": vacancy.id if hasattr(vacancy, 'id')
#                 #         else vacancy.hh_id or vacancy.superjob_id,
#                 "id": getattr(vacancy, 'id', None) or 
#                     getattr(vacancy, 'hh_id', None) or 
#                     getattr(vacancy, 'superjob_id', None) or 
#                     f"temp_{id(vacancy)}",
#                 "title": vacancy.title,
#                 "company": vacancy.company_name,
#                 "url": vacancy.url,
#                 "description": vacancy.description,
#                 "salary": vacancy.salary,
#                 "city": vacancy.city,
#                 "key_skills": vacancy.key_skills,
#                 "experience": vacancy.experience,
#             }
#             for vacancy in page_obj.object_list
#         ]

#         props = {
#             "region": {
#                 "id": region.id,
#                 "name": region.name,
#                 "code": region.code
#             },
#             "vacancies": {
#                 "data": vacancies_data,
#                 "current_page": page_obj.number,
#                 "total_pages": paginator.num_pages,
#                 "has_next": page_obj.has_next(),
#                 "has_previous": page_obj.has_previous(),
#             }
#         }

#         return inertia_render(request, "RegionPage", props)
    
# class RegionView(View):
#     def get(self, request, city_name):  # меняем region_id на city_name
#         # Ищем вакансии по городу, а не по региону
#         hh_vacancies = HhVacancy.objects.filter(city=city_name)
#         sj_vacancies = SuperjobVacancy.objects.filter(city=city_name)
#         all_vacancies = list(hh_vacancies) + list(sj_vacancies)

#         paginator = Paginator(all_vacancies, 25)
#         page_number = request.GET.get("page")
#         page_obj = paginator.get_page(page_number)

#         vacancies_data = [
#             {
#                 "id": getattr(vacancy, 'id', None) or 
#                     getattr(vacancy, 'hh_id', None) or 
#                     getattr(vacancy, 'superjob_id', None) or 
#                     f"temp_{id(vacancy)}",
#                 "title": vacancy.title,
#                 "company": vacancy.company_name,
#                 "url": vacancy.url,
#                 "description": vacancy.description,
#                 "salary": vacancy.salary,
#                 "city": vacancy.city,
#                 "key_skills": vacancy.key_skills,
#                 "experience": vacancy.experience,
#             }
#             for vacancy in page_obj.object_list
#         ]

#         props = {
#             "region": {  # оставляем для совместимости, но используем город
#                 "id": 0,  # заглушка
#                 "name": city_name,  # используем название города
#                 "code": city_name   # код тоже город
#             },
#             "vacancies": {
#                 "data": vacancies_data,
#                 "current_page": page_obj.number,
#                 "total_pages": paginator.num_pages,
#                 "has_next": page_obj.has_next(),
#                 "has_previous": page_obj.has_previous(),
#             }
#         }

#         return inertia_render(request, "RegionPage", props)
    
class RegionView(View):
    def get(self, request, city_name):
        hh_vacancies = HhVacancy.objects.filter(city=city_name)
        sj_vacancies = SuperjobVacancy.objects.filter(city=city_name)
        all_vacancies = list(hh_vacancies) + list(sj_vacancies)

        paginator = Paginator(all_vacancies, 25)
        page_number = request.GET.get("page")
        page_obj = paginator.get_page(page_number)

        vacancies_data = []
        for vacancy in page_obj.object_list:
            # Определяем key_skills в зависимости от типа вакансии
            if hasattr(vacancy, 'key_skills'):
                key_skills = vacancy.key_skills
            else:
                key_skills = ""  # или [] в зависимости от того, что ожидает фронтенд
            
            vacancies_data.append({
                "id": getattr(vacancy, 'id', None) or 
                    getattr(vacancy, 'hh_id', None) or 
                    getattr(vacancy, 'superjob_id', None) or 
                    f"temp_{id(vacancy)}",
                "title": vacancy.title,
                "company": vacancy.company_name,
                "url": vacancy.url,
                "description": vacancy.description,
                "salary": vacancy.salary,
                "city": vacancy.city,
                "key_skills": key_skills,  # используем обработанное значение
                "experience": vacancy.experience,
            })

        props = {
            "region": {
                "id": 0,
                "name": city_name,
                "code": city_name
            },
            "vacancies": {
                "data": vacancies_data,
                "current_page": page_obj.number,
                "total_pages": paginator.num_pages,
                "has_next": page_obj.has_next(),
                "has_previous": page_obj.has_previous(),
            }
        }

        return inertia_render(request, "region/ui/RegionPage", props)