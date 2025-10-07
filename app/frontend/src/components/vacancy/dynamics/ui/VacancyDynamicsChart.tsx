import React from "react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartColumn } from "lucide-react";
import { Card, Group, Title } from "@mantine/core";

interface VacancyDynamicsChartProps {
  data: { month: string; count: number}[]
}

export const VacancyDynamicsChart: React.FC<VacancyDynamicsChartProps> = ({ data }) => {
  return (
    <Card
      shadow="sm"
      radius="sm"
      p="md"
      mb="xl"
      withBorder
    >
      <Group>
        <ChartColumn color="#20B0B4"/>
        <Title order={2} c="#0c2e4d">
          Динамика вакансий
        </Title>
      </Group>
      <div style={{ 
        width: '100%', 
        margin: '0 auto',
        height: 200, 
        maxWidth: '50%'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 15, left: 15, bottom: 25 }}
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#20B0B4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#20B0B4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" interval={0} tick={{ fontSize: 12 }} />
            <CartesianGrid vertical={false} strokeDasharray="" />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#20B0B4" 
              fillOpacity={1} 
              fill="url(#chartGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}