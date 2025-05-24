const questionsByLanguage = {
  javascript: [
    // Easy
    {
      id: 'js-1',
      title: 'Array Sum',
      description: 'Write a function that takes an array of numbers and returns the sum of all the numbers.',
      difficulty: 'easy',
      examples: [
        { input: '[1, 2, 3]', output: '6' },
        { input: '[-1, 0, 1]', output: '0' }
      ],
      testCases: [
        { input: '[1, 2, 3, 4]', output: '10' },
        { input: '[]', output: '0' },
        { input: '[10, -10]', output: '0' }
      ],
      starterCode: 'function sumArray(arr) {\n  // Your code here\n}'
    },
    {
      id: 'js-2',
      title: 'String Length',
      description: 'Write a function that returns the length of a string without using the built-in length property.',
      difficulty: 'easy',
      examples: [
        { input: '"hello"', output: '5' },
        { input: '""', output: '0' }
      ],
      testCases: [
        { input: '"JavaScript"', output: '10' },
        { input: '" "', output: '1' },
        { input: '"a"', output: '1' }
      ],
      starterCode: 'function getLength(str) {\n  // Your code here\n}'
    },
    {
      id: 'js-3',
      title: 'Even Numbers Filter',
      description: 'Write a function that filters out even numbers from an array.',
      difficulty: 'easy',
      examples: [
        { input: '[1, 2, 3, 4, 5]', output: '[2, 4]' },
        { input: '[1, 3, 5]', output: '[]' }
      ],
      testCases: [
        { input: '[10, 15, 20, 25]', output: '[10, 20]' },
        { input: '[]', output: '[]' },
        { input: '[2, 4, 6]', output: '[2, 4, 6]' }
      ],
      starterCode: 'function filterEvens(arr) {\n  // Your code here\n}'
    },
    // Medium
    {
      id: 'js-4',
      title: 'Palindrome Check',
      description: 'Write a function that checks if a given string is a palindrome (reads the same backward as forward). Ignore spaces and case.',
      difficulty: 'medium',
      examples: [
        { input: '"racecar"', output: 'true' },
        { input: '"hello"', output: 'false' }
      ],
      testCases: [
        { input: '"A man a plan a canal Panama"', output: 'true' },
        { input: '"race a car"', output: 'false' },
        { input: '"Madam"', output: 'true' }
      ],
      starterCode: 'function isPalindrome(str) {\n  // Your code here\n}'
    },
    {
      id: 'js-5',
      title: 'Find Duplicates',
      description: 'Write a function that finds all duplicate elements in an array.',
      difficulty: 'medium',
      examples: [
        { input: '[1, 2, 3, 2, 4, 1]', output: '[1, 2]' },
        { input: '[1, 2, 3]', output: '[]' }
      ],
      testCases: [
        { input: '["a", "b", "a", "c", "b"]', output: '["a", "b"]' },
        { input: '[]', output: '[]' },
        { input: '[5, 5, 5]', output: '[5]' }
      ],
      starterCode: 'function findDuplicates(arr) {\n  // Your code here\n}'
    },
    {
      id: 'js-6',
      title: 'Factorial',
      description: 'Write a function that calculates the factorial of a number using recursion.',
      difficulty: 'medium',
      examples: [
        { input: '5', output: '120' },
        { input: '0', output: '1' }
      ],
      testCases: [
        { input: '3', output: '6' },
        { input: '1', output: '1' },
        { input: '7', output: '5040' }
      ],
      starterCode: 'function factorial(n) {\n  // Your code here\n}'
    },
    {
      id: 'js-7',
      title: 'Binary Search',
      description: 'Implement binary search algorithm to find the index of a target value in a sorted array.',
      difficulty: 'medium',
      examples: [
        { input: '[1, 3, 5, 7, 9], 5', output: '2' },
        { input: '[1, 3, 5, 7, 9], 6', output: '-1' }
      ],
      testCases: [
        { input: '[2, 4, 6, 8, 10], 8', output: '3' },
        { input: '[1], 1', output: '0' },
        { input: '[], 5', output: '-1' }
      ],
      starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n}'
    },
    // Hard
    {
      id: 'js-8',
      title: 'Longest Common Subsequence',
      description: 'Find the length of the longest common subsequence between two strings.',
      difficulty: 'hard',
      examples: [
        { input: '"abcde", "ace"', output: '3' },
        { input: '"abc", "def"', output: '0' }
      ],
      testCases: [
        { input: '"ABCDGH", "AEDFHR"', output: '3' },
        { input: '"AGGTAB", "GXTXAYB"', output: '4' },
        { input: '"", "abc"', output: '0' }
      ],
      starterCode: 'function longestCommonSubsequence(text1, text2) {\n  // Your code here\n}'
    },
    {
      id: 'js-9',
      title: 'Valid Parentheses',
      description: 'Check if a string of parentheses, brackets, and braces is valid (properly closed and nested).',
      difficulty: 'hard',
      examples: [
        { input: '"()"', output: 'true' },
        { input: '"([)]"', output: 'false' }
      ],
      testCases: [
        { input: '"{[]}"', output: 'true' },
        { input: '"((("', output: 'false' },
        { input: '""', output: 'true' }
      ],
      starterCode: 'function isValid(s) {\n  // Your code here\n}'
    },
    {
      id: 'js-10',
      title: 'Merge Sort',
      description: 'Implement the merge sort algorithm to sort an array of numbers.',
      difficulty: 'hard',
      examples: [
        { input: '[64, 34, 25, 12, 22, 11, 90]', output: '[11, 12, 22, 25, 34, 64, 90]' },
        { input: '[5, 2, 8, 1]', output: '[1, 2, 5, 8]' }
      ],
      testCases: [
        { input: '[3, 1, 4, 1, 5]', output: '[1, 1, 3, 4, 5]' },
        { input: '[]', output: '[]' },
        { input: '[1]', output: '[1]' }
      ],
      starterCode: 'function mergeSort(arr) {\n  // Your code here\n}'
    }
  ],

  python: [
    // Easy
    {
      id: 'py-1',
      title: 'List Average',
      description: 'Write a function that calculates the average of numbers in a list.',
      difficulty: 'easy',
      examples: [
        { input: '[1, 2, 3]', output: '2.0' },
        { input: '[10, 20, 30, 40]', output: '25.0' }
      ],
      testCases: [
        { input: '[5, 5, 5, 5]', output: '5.0' },
        { input: '[-1, 0, 1]', output: '0.0' },
        { input: '[]', output: '0.0' }
      ],
      starterCode: 'def average(lst):\n    # Your code here\n    pass'
    },
    {
      id: 'py-2',
      title: 'Count Vowels',
      description: 'Write a function that counts the number of vowels in a string.',
      difficulty: 'easy',
      examples: [
        { input: '"hello"', output: '2' },
        { input: '"python"', output: '1' }
      ],
      testCases: [
        { input: '"aeiou"', output: '5' },
        { input: '"bcdfg"', output: '0' },
        { input: '"Programming"', output: '3' }
      ],
      starterCode: 'def count_vowels(s):\n    # Your code here\n    pass'
    },
    {
      id: 'py-3',
      title: 'Reverse String',
      description: 'Write a function that reverses a string without using built-in reverse methods.',
      difficulty: 'easy',
      examples: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"world"', output: '"dlrow"' }
      ],
      testCases: [
        { input: '"Python"', output: '"nohtyP"' },
        { input: '""', output: '""' },
        { input: '"a"', output: '"a"' }
      ],
      starterCode: 'def reverse_string(s):\n    # Your code here\n    pass'
    },
    // Medium
    {
      id: 'py-4',
      title: 'Prime Number Check',
      description: 'Write a function that checks if a number is prime.',
      difficulty: 'medium',
      examples: [
        { input: '17', output: 'True' },
        { input: '4', output: 'False' }
      ],
      testCases: [
        { input: '2', output: 'True' },
        { input: '1', output: 'False' },
        { input: '97', output: 'True' }
      ],
      starterCode: 'def is_prime(n):\n    # Your code here\n    pass'
    },
    {
      id: 'py-5',
      title: 'Fibonacci Sequence',
      description: 'Generate the first n numbers in the Fibonacci sequence.',
      difficulty: 'medium',
      examples: [
        { input: '5', output: '[0, 1, 1, 2, 3]' },
        { input: '1', output: '[0]' }
      ],
      testCases: [
        { input: '8', output: '[0, 1, 1, 2, 3, 5, 8, 13]' },
        { input: '0', output: '[]' },
        { input: '2', output: '[0, 1]' }
      ],
      starterCode: 'def fibonacci(n):\n    # Your code here\n    pass'
    },
    {
      id: 'py-6',
      title: 'Anagram Check',
      description: 'Check if two strings are anagrams of each other.',
      difficulty: 'medium',
      examples: [
        { input: '"listen", "silent"', output: 'True' },
        { input: '"hello", "world"', output: 'False' }
      ],
      testCases: [
        { input: '"race", "care"', output: 'True' },
        { input: '"rat", "car"', output: 'False' },
        { input: '"", ""', output: 'True' }
      ],
      starterCode: 'def are_anagrams(s1, s2):\n    # Your code here\n    pass'
    },
    {
      id: 'py-7',
      title: 'Matrix Transpose',
      description: 'Write a function that transposes a 2D matrix.',
      difficulty: 'medium',
      examples: [
        { input: '[[1, 2], [3, 4]]', output: '[[1, 3], [2, 4]]' },
        { input: '[[1, 2, 3]]', output: '[[1], [2], [3]]' }
      ],
      testCases: [
        { input: '[[1, 2, 3], [4, 5, 6]]', output: '[[1, 4], [2, 5], [3, 6]]' },
        { input: '[]', output: '[]' },
        { input: '[[5]]', output: '[[5]]' }
      ],
      starterCode: 'def transpose(matrix):\n    # Your code here\n    pass'
    },
    // Hard
    {
      id: 'py-8',
      title: 'Longest Increasing Subsequence',
      description: 'Find the length of the longest increasing subsequence in an array.',
      difficulty: 'hard',
      examples: [
        { input: '[10, 9, 2, 5, 3, 7, 101, 18]', output: '4' },
        { input: '[0, 1, 0, 3, 2, 3]', output: '4' }
      ],
      testCases: [
        { input: '[7, 7, 7, 7, 7, 7, 7]', output: '1' },
        { input: '[]', output: '0' },
        { input: '[1, 3, 6, 7, 9, 4, 10, 5, 6]', output: '6' }
      ],
      starterCode: 'def length_of_lis(nums):\n    # Your code here\n    pass'
    },
    {
      id: 'py-9',
      title: 'Word Break',
      description: 'Determine if a string can be segmented into words from a given dictionary.',
      difficulty: 'hard',
      examples: [
        { input: '"leetcode", ["leet", "code"]', output: 'True' },
        { input: '"catsandog", ["cats", "dog", "sand", "and", "cat"]', output: 'False' }
      ],
      testCases: [
        { input: '"applepenapple", ["apple", "pen"]', output: 'True' },
        { input: '"cars", ["car", "ca", "rs"]', output: 'True' },
        { input: '""', output: 'True' }
      ],
      starterCode: 'def word_break(s, word_dict):\n    # Your code here\n    pass'
    },
    {
      id: 'py-10',
      title: 'N-Queens',
      description: 'Solve the N-Queens problem and return the number of distinct solutions.',
      difficulty: 'hard',
      examples: [
        { input: '4', output: '2' },
        { input: '1', output: '1' }
      ],
      testCases: [
        { input: '8', output: '92' },
        { input: '2', output: '0' },
        { input: '3', output: '0' }
      ],
      starterCode: 'def solve_n_queens(n):\n    # Your code here\n    pass'
    }
  ],

  java: [
    // Easy
    {
      id: 'java-1',
      title: 'Array Maximum',
      description: 'Write a method that finds the maximum element in an integer array.',
      difficulty: 'easy',
      examples: [
        { input: '[1, 5, 3, 9, 2]', output: '9' },
        { input: '[-1, -5, -2]', output: '-1' }
      ],
      testCases: [
        { input: '[10]', output: '10' },
        { input: '[3, 3, 3]', output: '3' },
        { input: '[100, 200, 50]', output: '200' }
      ],
      starterCode: 'public static int findMax(int[] arr) {\n    // Your code here\n}'
    },
    {
      id: 'java-2',
      title: 'String Reverse',
      description: 'Write a method that reverses a string using StringBuilder.',
      difficulty: 'easy',
      examples: [
        { input: '"hello"', output: '"olleh"' },
        { input: '"Java"', output: '"avaJ"' }
      ],
      testCases: [
        { input: '"Programming"', output: '"gnimmargorP"' },
        { input: '""', output: '""' },
        { input: '"a"', output: '"a"' }
      ],
      starterCode: 'public static String reverseString(String str) {\n    // Your code here\n}'
    },
    {
      id: 'java-3',
      title: 'Even Number Count',
      description: 'Count the number of even numbers in an array.',
      difficulty: 'easy',
      examples: [
        { input: '[1, 2, 3, 4, 5]', output: '2' },
        { input: '[1, 3, 5]', output: '0' }
      ],
      testCases: [
        { input: '[2, 4, 6, 8]', output: '4' },
        { input: '[]', output: '0' },
        { input: '[10, 15, 20]', output: '2' }
      ],
      starterCode: 'public static int countEvens(int[] arr) {\n    // Your code here\n}'
    },
    // Medium
    {
      id: 'java-4',
      title: 'Binary to Decimal',
      description: 'Convert a binary string to its decimal equivalent.',
      difficulty: 'medium',
      examples: [
        { input: '"1010"', output: '10' },
        { input: '"1111"', output: '15' }
      ],
      testCases: [
        { input: '"0"', output: '0' },
        { input: '"1"', output: '1' },
        { input: '"11010"', output: '26' }
      ],
      starterCode: 'public static int binaryToDecimal(String binary) {\n    // Your code here\n}'
    },
    {
      id: 'java-5',
      title: 'Array Rotation',
      description: 'Rotate an array to the right by k steps.',
      difficulty: 'medium',
      examples: [
        { input: '[1,2,3,4,5,6,7], k=3', output: '[5,6,7,1,2,3,4]' },
        { input: '[-1,-100,3,99], k=2', output: '[3,99,-1,-100]' }
      ],
      testCases: [
        { input: '[1,2], k=1', output: '[2,1]' },
        { input: '[1], k=0', output: '[1]' },
        { input: '[1,2,3], k=4', output: '[3,1,2]' }
      ],
      starterCode: 'public static void rotate(int[] nums, int k) {\n    // Your code here\n}'
    },
    {
      id: 'java-6',
      title: 'Two Sum',
      description: 'Find two numbers in an array that add up to a specific target.',
      difficulty: 'medium',
      examples: [
        { input: '[2,7,11,15], target=9', output: '[0,1]' },
        { input: '[3,2,4], target=6', output: '[1,2]' }
      ],
      testCases: [
        { input: '[3,3], target=6', output: '[0,1]' },
        { input: '[1,2,3,4], target=7', output: '[2,3]' },
        { input: '[5,75,25], target=100', output: '[1,2]' }
      ],
      starterCode: 'public static int[] twoSum(int[] nums, int target) {\n    // Your code here\n}'
    },
    {
      id: 'java-7',
      title: 'Merge Sorted Arrays',
      description: 'Merge two sorted arrays into one sorted array.',
      difficulty: 'medium',
      examples: [
        { input: '[1,2,3,0,0,0], m=3, [2,5,6], n=3', output: '[1,2,2,3,5,6]' },
        { input: '[1], m=1, [], n=0', output: '[1]' }
      ],
      testCases: [
        { input: '[0], m=0, [1], n=1', output: '[1]' },
        { input: '[4,5,6,0,0,0], m=3, [1,2,3], n=3', output: '[1,2,3,4,5,6]' },
        { input: '[2,0], m=1, [1], n=1', output: '[1,2]' }
      ],
      starterCode: 'public static void merge(int[] nums1, int m, int[] nums2, int n) {\n    // Your code here\n}'
    },
    // Hard
    {
      id: 'java-8',
      title: 'Longest Palindromic Substring',
      description: 'Find the longest palindromic substring in a given string.',
      difficulty: 'hard',
      examples: [
        { input: '"babad"', output: '"bab" or "aba"' },
        { input: '"cbbd"', output: '"bb"' }
      ],
      testCases: [
        { input: '"a"', output: '"a"' },
        { input: '"ac"', output: '"a" or "c"' },
        { input: '"racecar"', output: '"racecar"' }
      ],
      starterCode: 'public static String longestPalindrome(String s) {\n    // Your code here\n}'
    },
    {
      id: 'java-9',
      title: 'Regular Expression Matching',
      description: 'Implement regular expression matching with support for \'.\' and \'*\'.',
      difficulty: 'hard',
      examples: [
        { input: 's="aa", p="a"', output: 'false' },
        { input: 's="aa", p="a*"', output: 'true' }
      ],
      testCases: [
        { input: 's="ab", p=".*"', output: 'true' },
        { input: 's="aab", p="c*a*b"', output: 'true' },
        { input: 's="mississippi", p="mis*is*p*."', output: 'false' }
      ],
      starterCode: 'public static boolean isMatch(String s, String p) {\n    // Your code here\n}'
    },
    {
      id: 'java-10',
      title: 'Sudoku Solver',
      description: 'Solve a Sudoku puzzle by filling the empty cells.',
      difficulty: 'hard',
      examples: [
        { input: '9x9 board with some numbers filled', output: 'Complete valid Sudoku solution' }
      ],
      testCases: [
        { input: 'Standard Sudoku puzzle', output: 'Valid solution' },
        { input: 'Complex Sudoku puzzle', output: 'Valid solution' },
        { input: 'Nearly complete Sudoku', output: 'Valid solution' }
      ],
      starterCode: 'public static void solveSudoku(char[][] board) {\n    // Your code here\n}'
    }
  ],

  html: [
    // Easy
    {
      id: 'html-1',
      title: 'Basic HTML Structure',
      description: 'Create a basic HTML document with proper DOCTYPE, html, head, and body tags.',
      difficulty: 'easy',
      examples: [
        { input: 'Create basic structure', output: 'Valid HTML5 document' }
      ],
      testCases: [
        { input: 'Include title "My Page"', output: 'HTML with title' },
        { input: 'Add meta charset UTF-8', output: 'HTML with charset' },
        { input: 'Include viewport meta tag', output: 'Responsive HTML' }
      ],
      starterCode: '<!-- Create your HTML structure here -->'
    },
    {
      id: 'html-2',
      title: 'List Creation',
      description: 'Create an unordered list with 5 items about your favorite hobbies.',
      difficulty: 'easy',
      examples: [
        { input: 'Hobbies list', output: '<ul> with <li> items' }
      ],
      testCases: [
        { input: 'Ordered list version', output: '<ol> with numbered items' },
        { input: 'Nested list', output: 'List within a list' },
        { input: 'Definition list', output: '<dl> with terms and definitions' }
      ],
      starterCode: '<!-- Create your list here -->'
    },
    {
      id: 'html-3',
      title: 'Image and Links',
      description: 'Create an HTML page with an image and multiple links.',
      difficulty: 'easy',
      examples: [
        { input: 'Image with alt text', output: '<img> with proper attributes' },
        { input: 'External and internal links', output: 'Various <a> tags' }
      ],
      testCases: [
        { input: 'Link that opens in new tab', output: 'target="_blank"' },
        { input: 'Image as a link', output: '<a> wrapping <img>' },
        { input: 'Email link', output: 'mailto: link' }
      ],
      starterCode: '<!-- Create your image and links here -->'
    },
    // Medium
    {
      id: 'html-4',
      title: 'HTML Form',
      description: 'Create a contact form with various input types and proper labels.',
      difficulty: 'medium',
      examples: [
        { input: 'Contact form', output: 'Form with text, email, textarea inputs' }
      ],
      testCases: [
        { input: 'Include validation', output: 'Required fields and input types' },
        { input: 'Radio buttons and checkboxes', output: 'Multiple choice inputs' },
        { input: 'Submit and reset buttons', output: 'Form action buttons' }
      ],
      starterCode: '<!-- Create your form here -->'
    },
    {
      id: 'html-5',
      title: 'Table Structure',
      description: 'Create a well-structured HTML table with headers, data, and styling hooks.',
      difficulty: 'medium',
      examples: [
        { input: 'Student grades table', output: 'Table with thead, tbody, tfoot' }
      ],
      testCases: [
        { input: 'Table with colspan/rowspan', output: 'Merged cells' },
        { input: 'Sortable table headers', output: 'Clickable headers' },
        { input: 'Table with alternating rows', output: 'CSS classes for styling' }
      ],
      starterCode: '<!-- Create your table here -->'
    },
    {
      id: 'html-6',
      title: 'Semantic HTML',
      description: 'Create a blog post layout using semantic HTML5 elements.',
      difficulty: 'medium',
      examples: [
        { input: 'Blog post', output: 'article, header, section, aside, footer' }
      ],
      testCases: [
        { input: 'Navigation menu', output: 'nav element with links' },
        { input: 'Article with comments', output: 'Nested article elements' },
        { input: 'Sidebar content', output: 'aside with related content' }
      ],
      starterCode: '<!-- Create your semantic layout here -->'
    },
    {
      id: 'html-7',
      title: 'Media Elements',
      description: 'Create a multimedia page with audio, video, and interactive elements.',
      difficulty: 'medium',
      examples: [
        { input: 'Video player', output: '<video> with controls' },
        { input: 'Audio playlist', output: 'Multiple <audio> elements' }
      ],
      testCases: [
        { input: 'Video with subtitles', output: '<track> elements' },
        { input: 'Responsive media', output: 'Media queries and flexible sizing' },
        { input: 'Canvas element', output: 'Interactive drawing area' }
      ],
      starterCode: '<!-- Create your media elements here -->'
    },
    // Hard
    {
      id: 'html-8',
      title: 'Accessible Web Page',
      description: 'Create a fully accessible webpage following WCAG guidelines.',
      difficulty: 'hard',
      examples: [
        { input: 'Accessible form', output: 'ARIA labels, proper focus management' }
      ],
      testCases: [
        { input: 'Screen reader friendly', output: 'Alt texts, heading hierarchy' },
        { input: 'Keyboard navigation', output: 'Proper tab order, focus indicators' },
        { input: 'Color contrast compliance', output: 'WCAG AA compliant colors' }
      ],
      starterCode: '<!-- Create your accessible page here -->'
    },
    {
      id: 'html-9',
      title: 'Progressive Web App Shell',
      description: 'Create the HTML structure for a Progressive Web App with manifest and service worker references.',
      difficulty: 'hard',
      examples: [
        { input: 'PWA structure', output: 'Manifest link, service worker, meta tags' }
      ],
      testCases: [
        { input: 'Offline capability', output: 'Service worker registration' },
        { input: 'App-like experience', output: 'Viewport meta, theme colors' },
        { input: 'Install prompts', output: 'Web app manifest configuration' }
      ],
      starterCode: '<!-- Create your PWA shell here -->'
    },
       {
      id: 'html-10',
      title: 'Complex Data Visualization',
      description: 'Create an HTML structure for a dashboard with charts, graphs, and interactive data displays.',
      difficulty: 'hard',
      examples: [
        { input: 'Dashboard layout', output: 'Grid-based structure with multiple components' }
      ],
      testCases: [
        { input: 'Interactive charts', output: 'Canvas/SVG elements with data binding' },
        { input: 'Responsive layout', output: 'Adapts to different screen sizes' },
        { input: 'Data filtering controls', output: 'Input elements for user interaction' }
      ],
      starterCode: '<!-- Create your dashboard structure here -->'
    }
  ],

  css: [
    // Easy
    {
      id: 'css-1',
      title: 'Basic Styling',
      description: 'Style a simple HTML page with basic CSS properties.',
      difficulty: 'easy',
      examples: [
        { input: 'Change text color', output: 'Colored text using color property' },
        { input: 'Set background color', output: 'Background color applied' }
      ],
      testCases: [
        { input: 'Font family change', output: 'Text in specified font' },
        { input: 'Text alignment', output: 'Centered or justified text' },
        { input: 'Basic margins and padding', output: 'Spacing around elements' }
      ],
      starterCode: '/* Add your CSS styles here */'
    },
    {
      id: 'css-2',
      title: 'Box Model',
      description: 'Demonstrate understanding of the CSS box model with borders, margins, and padding.',
      difficulty: 'easy',
      examples: [
        { input: 'Create a bordered box', output: 'Element with visible border' },
        { input: 'Add padding inside box', output: 'Space between content and border' }
      ],
      testCases: [
        { input: 'Margin collapse', output: 'Proper spacing between elements' },
        { input: 'Different border styles', output: 'Dashed, dotted, solid borders' },
        { input: 'Box sizing property', output: 'Content-box vs border-box behavior' }
      ],
      starterCode: '/* Style your boxes here */'
    },
    {
      id: 'css-3',
      title: 'Simple Layout',
      description: 'Create a basic page layout with header, main content, and footer.',
      difficulty: 'easy',
      examples: [
        { input: 'Header styling', output: 'Styled header section' },
        { input: 'Footer at bottom', output: 'Footer stays at page bottom' }
      ],
      testCases: [
        { input: 'Centered content', output: 'Main content centered horizontally' },
        { input: 'Responsive basics', output: 'Layout adapts to screen width' },
        { input: 'Basic navigation bar', output: 'Horizontal or vertical nav' }
      ],
      starterCode: '/* Create your layout styles here */'
    },
    // Medium
    {
      id: 'css-4',
      title: 'Flexbox Layout',
      description: 'Create a responsive layout using CSS Flexbox.',
      difficulty: 'medium',
      examples: [
        { input: 'Horizontal navigation', output: 'Flex-based nav bar' },
        { input: 'Card grid', output: 'Evenly spaced cards' }
      ],
      testCases: [
        { input: 'Vertical centering', output: 'Perfectly centered element' },
        { input: 'Flex wrapping', output: 'Responsive wrapping items' },
        { input: 'Flex grow/shrink', output: 'Properly proportioned flex items' }
      ],
      starterCode: '/* Implement your flexbox layout here */'
    },
    {
      id: 'css-5',
      title: 'CSS Grid',
      description: 'Create a complex layout using CSS Grid.',
      difficulty: 'medium',
      examples: [
        { input: 'Magazine layout', output: 'Grid-based article layout' },
        { input: 'Image gallery', output: 'Grid-based responsive gallery' }
      ],
      testCases: [
        { input: 'Named grid areas', output: 'Layout using area names' },
        { input: 'Responsive grid', output: 'Adapts to different screen sizes' },
        { input: 'Grid gaps and alignment', output: 'Proper spacing and alignment' }
      ],
      starterCode: '/* Implement your grid layout here */'
    },
    {
      id: 'css-6',
      title: 'CSS Animations',
      description: 'Create smooth animations using CSS keyframes.',
      difficulty: 'medium',
      examples: [
        { input: 'Loading spinner', output: 'Animated rotating element' },
        { input: 'Hover effects', output: 'Smooth transitions on hover' }
      ],
      testCases: [
        { input: 'Bouncing animation', output: 'Element with bounce effect' },
        { input: 'Sequenced animations', output: 'Multiple elements animating in sequence' },
        { input: 'Performance optimization', output: 'Hardware-accelerated animations' }
      ],
      starterCode: '/* Create your animations here */'
    },
    {
      id: 'css-7',
      title: 'Responsive Design',
      description: 'Create a fully responsive webpage using media queries.',
      difficulty: 'medium',
      examples: [
        { input: 'Mobile-first approach', output: 'Styles for small screens first' },
        { input: 'Breakpoint adjustments', output: 'Layout changes at specific widths' }
      ],
      testCases: [
        { input: 'Responsive typography', output: 'Font sizes that adapt' },
        { input: 'Hamburger menu', output: 'Mobile navigation pattern' },
        { input: 'Image responsiveness', output: 'Images that scale properly' }
      ],
      starterCode: '/* Implement your responsive styles here */'
    },
    // Hard
    {
      id: 'css-8',
      title: 'CSS Custom Properties',
      description: 'Create a themeable design system using CSS variables.',
      difficulty: 'hard',
      examples: [
        { input: 'Color themes', output: 'Switchable color schemes' },
        { input: 'Design tokens', output: 'Consistent spacing/sizing variables' }
      ],
      testCases: [
        { input: 'Dark mode', output: 'Theme switching based on preference' },
        { input: 'Dynamic theming', output: 'JS-controlled variable changes' },
        { input: 'Fallback values', output: 'Graceful degradation' }
      ],
      starterCode: '/* Implement your CSS variables system here */'
    },
    {
      id: 'css-9',
      title: 'Advanced Selectors',
      description: 'Demonstrate complex CSS selector patterns.',
      difficulty: 'hard',
      examples: [
        { input: 'Nth-child patterns', output: 'Zebra striping, complex selections' },
        { input: 'Attribute selectors', output: 'Styling based on attributes' }
      ],
      testCases: [
        { input: 'State-based styling', output: 'Styles for various element states' },
        { input: 'Selector specificity', output: 'Proper selector priority' },
        { input: 'Performance considerations', output: 'Efficient selector patterns' }
      ],
      starterCode: '/* Demonstrate your selector skills here */'
    },
    {
      id: 'css-10',
      title: 'CSS Architecture',
      description: 'Implement a scalable CSS architecture (BEM, SMACSS, etc.).',
      difficulty: 'hard',
      examples: [
        { input: 'BEM methodology', output: 'Block__Element--Modifier pattern' },
        { input: 'Component-based styling', output: 'Isolated component styles' }
      ],
      testCases: [
        { input: 'Low specificity', output: 'Minimal !important usage' },
        { input: 'Reusable patterns', output: 'Utility classes and mixins' },
        { input: 'Style isolation', output: 'Prevent style leakage' }
      ],
      starterCode: '/* Implement your CSS architecture here */'
    }
  ],

  reactjs: [
    // Easy
    {
      id: 'react-1',
      title: 'Component Creation',
      description: 'Create a simple React functional component.',
      difficulty: 'easy',
      examples: [
        { input: 'Greeting component', output: 'Displays "Hello, World!"' }
      ],
      testCases: [
        { input: 'Props usage', output: 'Component accepts and displays props' },
        { input: 'JSX syntax', output: 'Proper JSX returned' },
        { input: 'Default export', output: 'Component is properly exported' }
      ],
      starterCode: 'function MyComponent() {\n  // Your code here\n}'
    },
    {
      id: 'react-2',
      title: 'State Management',
      description: 'Create a component with basic state using useState hook.',
      difficulty: 'easy',
      examples: [
        { input: 'Counter component', output: 'Button that increments a number' }
      ],
      testCases: [
        { input: 'Initial state', output: 'Proper initial value displayed' },
        { input: 'State update', output: 'State changes on interaction' },
        { input: 'Multiple state values', output: 'Independent state values' }
      ],
      starterCode: 'function StatefulComponent() {\n  // Your code here\n}'
    },
    {
      id: 'react-3',
      title: 'Event Handling',
      description: 'Create a component with event handlers.',
      difficulty: 'easy',
      examples: [
        { input: 'Button click handler', output: 'Alert or state change on click' }
      ],
      testCases: [
        { input: 'Form input handling', output: 'Input value captured and used' },
        { input: 'Prevent default', output: 'Form submission handled properly' },
        { input: 'Event object usage', output: 'Event properties accessed' }
      ],
      starterCode: 'function EventComponent() {\n  // Your code here\n}'
    },
    // Medium
    {
      id: 'react-4',
      title: 'Props Drilling',
      description: 'Create a component hierarchy with props passing.',
      difficulty: 'medium',
      examples: [
        { input: 'Parent-child components', output: 'Data flows through props' }
      ],
      testCases: [
        { input: 'Multiple levels', output: 'Props pass through intermediate components' },
        { input: 'Prop types', output: 'Type checking implemented' },
        { input: 'Default props', output: 'Fallback values when props not provided' }
      ],
      starterCode: 'function ParentComponent() {\n  // Your code here\n}'
    },
    {
      id: 'react-5',
      title: 'Conditional Rendering',
      description: 'Implement different rendering based on conditions.',
      difficulty: 'medium',
      examples: [
        { input: 'Loading state', output: 'Shows spinner when loading' }
      ],
      testCases: [
        { input: 'Ternary operator', output: 'Conditional JSX' },
        { input: 'Logical &&', output: 'Element shows when condition true' },
        { input: 'Switch case rendering', output: 'Multiple conditional outputs' }
      ],
      starterCode: 'function ConditionalComponent() {\n  // Your code here\n}'
    },
    {
      id: 'react-6',
      title: 'List Rendering',
      description: 'Render a list of items using map() with proper keys.',
      difficulty: 'medium',
      examples: [
        { input: 'Array of items', output: 'List of components' }
      ],
      testCases: [
        { input: 'Unique keys', output: 'No key warnings in console' },
        { input: 'Empty state', output: 'Handles empty array gracefully' },
        { input: 'Dynamic updates', output: 'List updates when data changes' }
      ],
      starterCode: 'function ListComponent() {\n  // Your code here\n}'
    },
    {
      id: 'react-7',
      title: 'useEffect Hook',
      description: 'Implement side effects in a component.',
      difficulty: 'medium',
      examples: [
        { input: 'Data fetching', output: 'Loads data on mount' }
      ],
      testCases: [
        { input: 'Dependency array', output: 'Effect runs when dependencies change' },
        { input: 'Cleanup function', output: 'Prevents memory leaks' },
        { input: 'Multiple effects', output: 'Separate concerns' }
      ],
      starterCode: 'function EffectComponent() {\n  // Your code here\n}'
    },
    // Hard
    {
      id: 'react-8',
      title: 'Context API',
      description: 'Implement global state management using Context.',
      difficulty: 'hard',
      examples: [
        { input: 'Theme context', output: 'Components access theme anywhere' }
      ],
      testCases: [
        { input: 'Provider pattern', output: 'Context provides values to tree' },
        { input: 'Consumer component', output: 'Component uses context value' },
        { input: 'Performance optimization', output: 'Prevents unnecessary rerenders' }
      ],
      starterCode: '// Create your context and provider here'
    },
    {
      id: 'react-9',
      title: 'Custom Hooks',
      description: 'Create a reusable custom hook.',
      difficulty: 'hard',
      examples: [
        { input: 'useLocalStorage hook', output: 'Syncs state with localStorage' }
      ],
      testCases: [
        { input: 'Hook composition', output: 'Uses built-in hooks internally' },
        { input: 'Reusability', output: 'Works in multiple components' },
        { input: 'Type safety', output: 'Proper TypeScript types if applicable' }
      ],
      starterCode: 'function useCustomHook() {\n  // Your code here\n}'
    },
    {
      id: 'react-10',
      title: 'Performance Optimization',
      description: 'Optimize a React application for performance.',
      difficulty: 'hard',
      examples: [
        { input: 'Memoization', output: 'useMemo and useCallback usage' }
      ],
      testCases: [
        { input: 'React.memo', output: 'Prevents unnecessary rerenders' },
        { input: 'Code splitting', output: 'Lazy-loaded components' },
        { input: 'Profiling', output: 'Identified and fixed bottlenecks' }
      ],
      starterCode: 'function OptimizedComponent() {\n  // Your code here\n}'
    }
  ]
};
export function generateQuestions(language, count) {
  const langQuestions = questionsByLanguage[language.toLowerCase()] || [];
  // Shuffle and pick 'count' questions
  return [...langQuestions].sort(() => 0.5 - Math.random()).slice(0, count);
}