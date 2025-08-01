export const downloadCSV = (data) => {
  if (!data || data.length === 0) {
    alert("No data to download.");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), 
    ...data.map(row => 
      headers.map(fieldName => 
        JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)
      ).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'registrations.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};