// async function timeDifference(){
//     const today = new Date();
//     console.log(today)
//     await new Promise(r => setTimeout(r, 10000));
//     const endDate = new Date();
//     console.log(endDate)

//     const days = ((endDate - today) / (1000 * 60 * 60 * 24));
//     const hours = (Math.abs(endDate - today) / (1000 * 60 * 60) % 24);
//     const minutes = (Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60) % 60);
//     const seconds = (Math.abs(endDate.getTime() - today.getTime()) / (1000) % 60); 

//     console.log(days)
//     console.log(hours)
//     console.log(minutes)
//     console.log(seconds)
// }

// timeDifference();