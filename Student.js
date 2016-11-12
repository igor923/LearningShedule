'use strict';
class Student{

     constructor(name,lastname,phone,email,adress,passportID,status){
           this.name = name;
           this.lastname = lastname;
           this.phone = phone;
           this.email = email;
           this.adress = adress;
           this.passportID = passportID;
     }

     toString(){
         return console.log("name: " + this.name + ";\n" +
                 "lastname: " + this.lastname + ";\n" +
                 "phone: " + this.phone + ";\n" +
                 "email: " + this.email + ";\n" +
                 "adress: " + this.adress + ";\n" +
                 "passportID"  + this.passportID + ";\n");
     }

     getAll(){
         for(var key in this ) {
             console.log(key + ":" + this[key]);
         }
     }

}


var s1 = new Student("Gennadii", "Tsypenko", "0544564564", "asda@gmail.com", "Bar Kochva", "45645665");
s1.toString();
s1.getAll();
console.log(s1.name);

