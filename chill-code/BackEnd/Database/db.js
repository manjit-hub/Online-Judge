//Create a Database => import MongoDB
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Connected with dotenv
dotenv.config();
const Tag = require('../models/Tag');

const tags = [
    "Array", "Linked List", "Stack", "Queue", "Hash Table", "Heap", "Binary Tree", "Binary Search Tree",
    "Graph", "Trie", "Sorting", "Searching", "Dynamic Programming", "Backtracking", "Greedy Algorithm",
    "Divide and Conquer", "Bit Manipulation", "Recursion", "Memoization", "Two Pointers", "Sliding Window",
    "Binary Search", "Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Tree Traversal", "Union-Find",
    "Shortest Path", "Topological Sort", "Minimum Spanning Tree", "Graph Coloring", "Flood Fill",
    "Knapsack", "Longest Common Subsequence (LCS)", "Longest Increasing Subsequence (LIS)",
    "Kadane's Algorithm", "Dijkstra's Algorithm", "Bellman-Ford Algorithm", "Floyd-Warshall Algorithm",
    "Kruskal's Algorithm", "Prim's Algorithm", "Heap Sort", "Merge Sort", "Quick Sort", "Radix Sort",
    "Counting Sort", "Bucket Sort", "Cycle Detection", "Palindrome", "String Matching", "KMP Algorithm",
    "Trie Traversal", "Suffix Array", "Binary Indexed Tree", "Segment Tree", "Fenwick Tree", "AVL Tree",
    "Red-Black Tree", "Sparse Table", "Modular Arithmetic", "Greatest Common Divisor (GCD)",
    "Least Common Multiple (LCM)", "Euclidean Algorithm", "Prime Numbers", "Sieve of Eratosthenes",
    "Permutation", "Combination", "Probability", "Matrix Operations", "Exponentiation", "Game Theory",
    "Mo's Algorithm", "Bitmasking", "Probability", "Math", "Prefix Sum", "Suffix Sum"
];


// console.log(process.env.MONGODB_URL);   // Check MONGODB_URL    
const DBConnection = async () => {
    const MONGO_URL = process.env.MONGODB_URL;

    // Check if MONGO_URL is defined
    if (!MONGO_URL) {
        console.error('MONGODB_URL is not defined in environment variables');
        return;
    }

    try{
        await mongoose.connect(MONGO_URL);
        console.log("DB connection established");

        // Insert tags if they don't already exist
        const existingTags = await Tag.find({});
        if (existingTags.length === 0) {
            await Tag.insertMany(tags.map(tag => ({ name: tag })));
            console.log("Tags populated successfully");
        } else {
            console.log("Tags already exist in the database");
        }

    }
    catch(error){
        console.log("Error while connecting to Mongo DB", error);
    }
};

module.exports = {DBConnection}; //Different than normal export