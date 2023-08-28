
function test()
{
    console.log("Entered")
    fetch("https://chess-trfs.onrender.com/api/v1/test")
    .then((res) => res.json())
    .then((data) => {
console.log("success");
// console.log(data)
}).catch(err=>{
    // console.log(err);
    // cout<<"failed\n"; 
    console.log("failed");
    })
}
 test();
let x=setInterval(test, 1000*60*30);
