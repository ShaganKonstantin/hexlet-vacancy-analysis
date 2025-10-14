import React from "react";
import { Card, Badge, Text, Group, Stack } from '@mantine/core';
import { formatSalary } from "../../utils/FormatSalary";
import { truncateText } from "../../utils/TruncateText";
import type { VacancyProps } from "../../../vacancy/model/types";
// import { Link } from '@inertiajs/react';

export const VacancyCard: React.FC<VacancyProps> = (props) => {
  const { title, description, company, salary, city, key_skills } = props;

  return (
    // <Link href={`/vacancies/${id}`}>
      <Card shadow="sm" padding="lg" radius="md" withBorder mx="auto" style={{ width: '100%'}}>
      {/* Информация о должности и город */}
      <Stack mb="md" gap={3}>
        <Text fw={700} size="xl" c="#0d2e4e">{title}</Text>
        <Text size="md" c="#69717d">{company} &bull; {city}</Text>
      </Stack>

      {/* Зарплата и описание*/}
      <Group justify="space-between" align="flex-start" mb="sm">
        <Text size="md" c="#69717d" fw={500}>Зарплата:</Text>
        <Badge size="lg" radius="xl" color="#20B0B4">
          {formatSalary(salary)}
        </Badge>
      </Group>
      <Text size="md" c="#69717d" mb="md">{truncateText(description, 50)}</Text>

      {/* Ключевые навыки */}
      <Group gap="xs" wrap="wrap">
        {key_skills.map((skill) => (
          <Badge key={skill} variant="outline" radius="xl" color="#0d2e4e" size="lg" 
            styles={{ root: {
              borderColor: '#E5E7EB', 
              color: '#0d2e4e', 
              },
            }}
            >
            {skill}
          </Badge>
        ))}
      </Group>
    </Card>
    // </Link>
  );
};