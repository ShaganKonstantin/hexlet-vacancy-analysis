/* Меняет название валюты на значок: например, доллар - $ */

export const formatSalary = (salaryStr: string): string => {
  const formatted = salaryStr.replace(/\d+/g, (match) => {
    return parseInt(match).toLocaleString('ru-RU');
  });
  
  return formatted
    .replace(/(евро|euro|eur)/gi, '€')
    .replace(/(доллар|usd|\$)(ов|а)?/gi, '$')
  /* Разбиваем регулярку для белоруссов, потому что целая ищет "бел" как отдельное слово в "белорусских" и заменяет его на "Br", а потом добавляется остаток слова */
    .replace(/белорусских\s*рубл(ей)?/gi, 'Br') 
    .replace(/\b(бел|byn|br)\b/gi, 'Br') 
    .replace(/(рубл|руб|rub|р\.?)(ей|я|ю|ем)?/gi, '₽')
    .replace(/(тенге|kzt|₸|тг)/gi, '₸')
    .replace(/\s+/g, ' ')
    .trim();
}