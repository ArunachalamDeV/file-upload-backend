
exports.date = () =>{
    const indiaTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full', // optional: formats the date as well
        timeStyle: 'medium' // optional: formats the time
      }).format(new Date());
      return indiaTime

}
