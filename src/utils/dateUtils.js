//================== dateUtils.js ===========================//
// utility functions for handling the conversion of dates
//================================================================//

//formats a date from firestore to work with js
export const formatDateFirestoreJs = (dateInput) => {
    try {
      // get the date from the input
      const jsDate = dateInput?.toDate ? dateInput.toDate() : new Date(dateInput);
      // if its NaN then simply return invalid date
      if (isNaN(jsDate.getTime())) return "Invalid date";
      //otherwise return it in the international date format
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(jsDate);
    } catch (err) {
      return "Invalid date";
    }
  };