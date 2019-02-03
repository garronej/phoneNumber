
import { phoneNumber } from "../lib";

console.assert(!phoneNumber.isDialable(""));
console.assert(phoneNumber.isDialable("#123#"));
console.assert(!phoneNumber.isDialable("134alice"));

//Base use case
{
  const number = phoneNumber.build("0636786385", "fr");
  console.assert(number === "+33636786385");

  for( const raw of [ 
    number, 
    "06 36 78 63 85", 
    "0033636786385", 
    "00 33 636786385", 
    "+33 6 36 78 63 85", 
    "0636786385", 
    "+336 36786385" 
  ] ){
    console.assert(phoneNumber.areSame(number, raw));
  }

  console.assert( phoneNumber.prettyPrint( number, "fr" ) === "06 36 78 63 85" );

  for( const formatedNumber of [ "it", "us", undefined ].map( iso => phoneNumber.prettyPrint(number, iso ) ) ){
    console.assert( formatedNumber === "+33 6 36 78 63 85" );
  }

}

//Can't be a french number, only stripe space.
{
  const number = phoneNumber.build("302 44444444", "fr");
  console.assert(number === "30244444444");
  console.assert(phoneNumber.isDialable(number));
  console.assert( phoneNumber.prettyPrint(number) === number );
  console.assert( phoneNumber.prettyPrint(number, "fr") === number );
  console.assert( phoneNumber.prettyPrint(number, "it") === number );
}

//Enough information to know that this is not a italian number. Iso ignored
{
  const number = phoneNumber.build("0033636786385", "it");
  console.assert(number === "+33636786385");
}

//In this case, unfortunately, this french number can be an italian number.
{
  const number = phoneNumber.build("06 36 78 63 85", "it");
  console.assert(number === "+390636786385");
}

console.log("PASS");
