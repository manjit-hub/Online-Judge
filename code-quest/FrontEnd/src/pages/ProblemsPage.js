
import './ProblemsCSS.css';

// function ProblemsPage() {
//   return(
//       <div className="split">
//         <div className="dashboard">
//           <button className='btnPrb'><img src="/Assets/DashboardLogo.png" alt="Logo" />Dashboard</button>
//           <button className='btnPrb'><img src="/Assets/3LineLogo.png" alt="" />Leaderboard</button>
//           <button className='btnPrb'><img src="/Assets/DiscussionLogo.png" alt="Logo" />Discussion</button>
//           <button className='btnPrb'><img src="/Assets/ProgressLogo.png" alt="" />Progress</button>
//           <button className='btnPrb'><img src="/Assets/ProfileLogo.png" alt="" />Profile</button>
//         </div>

//         <div className="rightSide">
//           <div className="search">
//             <h1>Problems</h1>
//             <input type="text" className="inpPrb" placeholder="Search Problems" />
//           </div>

//           <div className="tags">
//             <button className='PrbTagsBtn'>All</button>
//             <button className='PrbTagsBtn'>Easy</button>
//             <button className='PrbTagsBtn'>Medium</button>
//             <button className='PrbTagsBtn'>Hard</button>
//             <button className='PrbTagsBtn'>Binary Search</button>
//             <button className='PrbTagsBtn'>Recursion</button>
//             <button className='PrbTagsBtn'>DP</button>
//             <button className='PrbTagsBtn'>Back Tracking</button>
//             <button className='PrbTagsBtn'>Graph</button>
//             <button className='PrbTagsBtn'>Array</button>
//           </div>

//           {/* ----- PROBLEMS ----- */}
//           <div className="problems">
//           const CodingProblems = () => {
//               const codingProblems = [
//                   { title: "Palindrome Check", difficulty: "Easy", solved: "No", acceptance_rate: 80.25 },
//                   { title: "Reverse Linked List", difficulty: "Medium", solved: "No", acceptance_rate: 60.75 },
//                   { title: "Stack Implementation", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 },
//                   { title: "Queue using Stacks", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
//                   { title: "Factorial Recursion", difficulty: "Easy", solved: "No", acceptance_rate: 90.75 },
//                   { title: "Binary Search", difficulty: "Easy", solved: "No", acceptance_rate: 85.25 },
//                   { title: "Nth Fibonacci", difficulty: "Medium", solved: "No", acceptance_rate: 65.50 },
//                   { title: "BST Check", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
//                   { title: "Selection Sort", difficulty: "Easy", solved: "No", acceptance_rate: 90.50 },
//                   { title: "Shortest Path (Dijkstra)", difficulty: "Hard", solved: "No", acceptance_rate: 40.75 },
//                   { title: "Priority Queue (Heap)", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
//                   { title: "Anagram Check", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 },
//                   { title: "Longest Substring", difficulty: "Medium", solved: "No", acceptance_rate: 65.75 },
//                   { title: "DFS on Graph", difficulty: "Easy", solved: "No", acceptance_rate: 85.25 },
//                   { title: "DFS Binary Tree", difficulty: "Medium", solved: "No", acceptance_rate: 70.50 },
//                   { title: "Trie Implementation", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
//                   { title: "Power Recursion", difficulty: "Easy", solved: "No", acceptance_rate: 90.50 },
//                   { title: "Shortest Path (Maze)", difficulty: "Hard", solved: "No", acceptance_rate: 30.75 },
//                   { title: "Quicksort", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
//                   { title: "BFS on Graph", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 }
//               ];

//               return (
//                   <div className="list">
//                       <table>
//                           <thead>
//                               <tr>
//                                   <th>No</th>
//                                   <th>Name</th>
//                                   <th>Difficulty</th>
//                                   <th>Solved</th>
//                                   <th>Acceptance Rate</th>
//                               </tr>
//                           </thead>
//                           <tbody>
//                               {codingProblems.map((problem, index) => (
//                                   <tr key={index}>
//                                       <td>{index + 1}</td>
//                                       <td>{problem.title}</td>
//                                       <td>{problem.difficulty}</td>
//                                       <td>{problem.solved}</td>
//                                       <td>{problem.acceptance_rate}%</td>
//                                   </tr>
//                               ))}
//                           </tbody>
//                       </table>
//                   </div>
//               );
//           }

//           export default CodingProblems;
//         </div>
//       </div>
//       </div>

//   );
// }

// export default ProblemsPage;


import React from 'react';
import './ProblemsCSS.css';

// Define the CodingProblems component outside of the ProblemsPage component
const CodingProblems = () => {
  const codingProblems = [
    { title: "Palindrome Check", difficulty: "Easy", solved: "No", acceptance_rate: 80.25 },
    { title: "Reverse Linked List", difficulty: "Medium", solved: "No", acceptance_rate: 60.75 },
    { title: "Stack Implementation", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 },
    { title: "Queue using Stacks", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
    { title: "Factorial Recursion", difficulty: "Easy", solved: "No", acceptance_rate: 90.75 },
    { title: "Binary Search", difficulty: "Easy", solved: "No", acceptance_rate: 85.25 },
    { title: "Nth Fibonacci", difficulty: "Medium", solved: "No", acceptance_rate: 65.50 },
    { title: "BST Check", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
    { title: "Selection Sort", difficulty: "Easy", solved: "No", acceptance_rate: 90.50 },
    { title: "Shortest Path (Dijkstra)", difficulty: "Hard", solved: "No", acceptance_rate: 40.75 },
    { title: "Priority Queue (Heap)", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
    { title: "Anagram Check", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 },
    { title: "Longest Substring", difficulty: "Medium", solved: "No", acceptance_rate: 65.75 },
    { title: "DFS on Graph", difficulty: "Easy", solved: "No", acceptance_rate: 85.25 },
    { title: "DFS Binary Tree", difficulty: "Medium", solved: "No", acceptance_rate: 70.50 },
    { title: "Trie Implementation", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
    { title: "Power Recursion", difficulty: "Easy", solved: "No", acceptance_rate: 90.50 },
    { title: "Shortest Path (Maze)", difficulty: "Hard", solved: "No", acceptance_rate: 30.75 },
    { title: "Quicksort", difficulty: "Medium", solved: "No", acceptance_rate: 70.25 },
    { title: "BFS on Graph", difficulty: "Easy", solved: "No", acceptance_rate: 85.50 }
  ];

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>TITLE</th>
            <th>DIFFICULTY</th>
            <th>SOLVED</th>
            <th>ACCEPTANCE RATE</th>
          </tr>
        </thead>
        <tbody>
          {codingProblems.map((problem, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{problem.title}</td>
              <td>{problem.difficulty}</td>
              <td>{problem.solved}</td>
              <td>{problem.acceptance_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProblemsPage() {
  return (
      <div className="split">
        <div className="dashboard">
          <button className='btnPrb'><img src="/Assets/DashboardLogo.png" alt="Logo" />Dashboard</button>
          <button className='btnPrb'><img src="/Assets/3LineLogo.png" alt="Logo" />Leaderboard</button>
          <button className='btnPrb'><img src="/Assets/DiscussionLogo.png" alt="Logo" />Discussion</button>
          <button className='btnPrb'><img src="/Assets/ProgressLogo.png" alt="Logo" />Progress</button>
          <button className='btnPrb'><img src="/Assets/ProfileLogo.png" alt="Logo" />Profile</button>
        </div>

        <div className="rightSide">
          <div className="search">
            <h1>Problems</h1>
            <input type="text" className="inpPrb" placeholder="Search Problems" />
          </div>

          <div className="tags">
            <button className='PrbTagsBtn'>All</button>
            <button className='PrbTagsBtn'>Easy</button>
            <button className='PrbTagsBtn'>Medium</button>
            <button className='PrbTagsBtn'>Hard</button>
            <button className='PrbTagsBtn'>Binary Search</button>
            <button className='PrbTagsBtn'>Recursion</button>
            <button className='PrbTagsBtn'>DP</button>
            <button className='PrbTagsBtn'>Back Tracking</button>
            <button className='PrbTagsBtn'>Graph</button>
            <button className='PrbTagsBtn'>Array</button>
            <button className='PrbTagsBtn'>String</button>
            <button className='PrbTagsBtn'>LinkedList</button>
          </div>

        {/* Problems component */}
        <CodingProblems />
      </div>
    </div>
  );
}

export default ProblemsPage;