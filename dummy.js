const db=require("./config/dbconfig.js")
const mongoose=require("mongoose")
const product=require("./Models/product")

product.insertMany([{
    name:"Lords of the Rings",
    image:"https://orion-uploads.openroadmedia.com/md_f7e651-tolkien-lordoftherings.jpg",
    mrp:400,
    category:"books",
    price:300,
    disc_perc:25,
    discount:100,
    category:"books",
},{
    name:"Harry Potter and the Curse Child",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKtjUjBs8U5OtKpATKNGBFdR2HcWLbhFboow&usqp=CAU",
    mrp:500,
    category:"books",
    price:450,
    disc_perc:10,
    discount:50,
    category:"books",
}]).then(()=>{
    console.log("Data is inserted")
}).catch((e)=>{
    console.log("error")
})