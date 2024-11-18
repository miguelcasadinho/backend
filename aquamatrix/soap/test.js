let hasDATA_LEITURA = '2024/10/22';
let formattedDate;

if (hasDATA_LEITURA) {
    let parts = hasDATA_LEITURA.split('/'); // Split the date by '/'
    let year = parseInt(parts[0]);
    let month = parseInt(parts[1]) - 1; // Month in Date object is 0-indexed
    let day = parseInt(parts[2]);

    // Use Date.UTC to avoid time zone issues
    let date = new Date(Date.UTC(year, month, day));
    hasDATA_LEITURA = date.toISOString().substring(0, 10); // Get YYYY-MM-DD format

    console.log(hasDATA_LEITURA)
}
