// import React from "react";

// const Pagination = ({ currentPage, totalPages, onPageChange }) => {
//   const pageNumbers = [];

//   // Generate page numbers
//   for (let i = 1; i <= totalPages; i++) {
//     pageNumbers.push(i);
//   }

//   return (
    // <div
    //   // style={styles.container}
    //   className="flex justify-end gap-3"
    // >
    //   <button
    //     onClick={() => onPageChange(currentPage - 1)}
    //     disabled={currentPage === 1}
    //     style={styles.button}
    //     className={`${
    //       currentPage === 1
    //         ? "cursor-not-allowed opacity-60 bg-[#f9f9f9]"
    //         : "cursor-pointer"
    //     }`}
    //   >
    //     Prev
    //   </button>

//       {pageNumbers.map((number) => (
//         <button
//           key={number}
//           onClick={() => onPageChange(number)}
//           style={{
//             ...styles.button,
//             ...(number === currentPage ? styles.active : {}),
//           }}
//         >
//           {number}
//         </button>
//       ))}

    //   <button
    //     onClick={() => onPageChange(currentPage + 1)}
    //     disabled={currentPage === totalPages}
    //     style={styles.button}
    //     className={`${
    //       currentPage === totalPages
    //         ? "cursor-not-allowed  opacity-60 bg-[#f9f9f9]"
    //         : "cursor-pointer"
    //     }`}
    //   >
    //     Next
    //   </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     gap: "8px",
//     justifyContent: "center",
//     margin: "20px 0",
//     borderRadius: "5px",
//   },
//   button: {
//     padding: "6px 18px",
//     border: "1px solid #ccc",
//     borderRadius: "5px",
//   },
//   active: {
//     backgroundColor: "#8c0707",
//     color: "white",
//     borderRadius: "5px",
//     padding: "0 28px",
//     fontWeight: "600",
//   },
// };

// export default Pagination;


import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
const getPageNumbers = () => {
  const pages = [];

  if (totalPages <= 5) {
    // Show all pages if 5 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1); // Always show first

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages); // Always show last
  }

  return pages;
};

  const pageNumbers = getPageNumbers();

  return (
    <div
      // style={styles.container}
      className="flex justify-end gap-3"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={styles.button}
        className={`${
          currentPage === 1
            ? "cursor-not-allowed opacity-60 bg-[#f9f9f9]"
            : "cursor-pointer"
        }`}
      >
        Prev
      </button>

      {pageNumbers.map((number, index) => {
        if (number === "...") {
          return (
            <span key={`ellipsis-${index}`} style={styles.ellipsis}>
              ...
            </span>
          );
        }

        return (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            style={{
              ...styles.button,
              ...(number === currentPage ? styles.active : {}),
            }}
          >
            {number}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={styles.button}
        className={`${
          currentPage === totalPages
            ? "cursor-not-allowed  opacity-60 bg-[#f9f9f9]"
            : "cursor-pointer"
        }`}
      >
        Next
      </button>
    </div>
  );
};

const styles = {
 
    container: {
      display: "flex",
      gap: "8px",
      justifyContent: "center",
      margin: "20px 0",
      borderRadius: "5px",
    },
    button: {
      padding: "6px 18px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    active: {
      backgroundColor: "#8c0707",
      color: "white",
      borderRadius: "5px",
      padding: "0 28px",
      fontWeight: "600",
    },
  
  ellipsis: {
    padding: "6px 12px",
    color: "#888",
  },
}

export default Pagination;