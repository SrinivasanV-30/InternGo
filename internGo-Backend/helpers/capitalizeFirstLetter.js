export const capitalizeFirstLetter=(word)=>{
    let firstCapitalLetter=word.charAt(0).toUpperCase();
    let remainingLetters=word.slice(1);
    return firstCapitalLetter+remainingLetters;
}