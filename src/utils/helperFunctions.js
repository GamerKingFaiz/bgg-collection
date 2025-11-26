export const addFilterPlaceholder = () => {
    const filters = document.querySelectorAll("div.rt-th > input");
    for (let filter of filters) {
      filter.placeholder = "Search...";
    }
}

/*******************************
New function to call setTimeout otherwise recursiveFetchAndWait() would be run again 
when you pass it to the default JS setTimeout function because it has a parameter.
********************************/
export const setTimeoutAsCallback = (callback) => {
    setTimeout(callback, 2500);
}