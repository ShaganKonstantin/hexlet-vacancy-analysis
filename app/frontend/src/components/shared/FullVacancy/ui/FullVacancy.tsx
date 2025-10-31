import React from "react";
import type { VacancyCardProps } from "../../../../types";
import { Card, Group, Text, Badge, List, ThemeIcon } from '@mantine/core';
import { FileText, SquareCheckBig, CircleCheck, Briefcase, CircleSmall, Tag } from "lucide-react";

interface FullVacancyProps {
  props: VacancyCardProps;
}

const requirements = [
  'Опыт работы с Python от 3 лет', 
  'Знание Django или FastAPI', 
  'Опыт работы с PostgreSQL',
  'Понимание принципов REST API',
  'Знание Git и CI/CD',
]

const responsibilities = [
  'Разработка и поддержка backend сервисов',
  'Проектирование API',
  'Оптимизация запросов к базе данных',
  'Участие в code review',
]

export const FullVacancy: React.FC<FullVacancyProps> = ({ props }) => {

  const { skills, description } = props;
  return (
        <Card padding="none">
          {/* Описание вакансии */}
          <Card shadow="sm" withBorder mb={20}>
            <Group gap={5}mb={5}>
              <FileText color="#20B0B4"/>
              <Text fw={700} size="xl" c="#0d2e4e">Описание вакансии</Text>
            </Group>
            <Text>{description}</Text>
          </Card>
    
          {/* Требования */}
          <Card shadow="sm" withBorder mb={20}>
            <Group gap={5} mb={5}>
              <SquareCheckBig color="#20B0B4"/>
              <Text fw={700} size="xl" c="#0d2e4e">Требования</Text>
            </Group>
            {requirements.map((requirement) => (
              <List 
                key={requirement}
                spacing='xs'
                size="md"
                icon={
                  <ThemeIcon color="#20B0B4" variant="subtle">
                    <CircleCheck size={16}/>
                  </ThemeIcon>
                }
              >
                <List.Item>{requirement}</List.Item>
              </List>
            ))}
          </Card>
    
          {/* Обязанности */}
          <Card shadow="sm" withBorder mb={20}>
            <Group gap={5} mb={5}>
              <Briefcase color="#20B0B4"/>
              <Text fw={700} size="xl" c="#0d2e4e">Обязанности</Text>
            </Group>
            {responsibilities.map((responsibility) => (
              <List 
                key={responsibility}
                spacing='xs'
                size="md"
                icon={
                  <ThemeIcon color="#20B0B4" variant="subtle">
                    <CircleSmall size={16}/>
                  </ThemeIcon>
                }
              >
                <List.Item>{responsibility}</List.Item>
              </List>
            ))}
          </Card>
    
          {/* Технологии */}
          <Card shadow="sm" withBorder mb={20}>
            <Group gap={5} mb={20}>
              <Tag color="#20B0B4"/>
              <Text fw={700} size="xl" c="#0d2e4e">Технологии</Text>
            </Group>
            <Group>
              {skills && skills.length > 0 ? (
                skills.map((skill) => (
                  <Badge
                  color="#20B0B4"
                  variant="outline"
                  size="xl"
                >
                  {skill}
                </Badge>
                ))
              ) : (
                <Text fw={700} size="md" c="#0d2e4e">Требований к технологиям нет</Text>
              )}
            </Group>
          </Card>
        </Card>
  )
}