import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const skillPages = {
  "HTML & CSS": [
    { title: "Overview", content: `HTML, or HyperText Markup Language, is the standard language for creating web pages. It provides the     
         structure of a webpage through various tags and elements. The root element is html, which contains the head for metadata, title,
          scripts, and styles, and the body which holds the visible content. Headings are defined using h1 to h6 tags, while paragraphs use p. 
          Line breaks can be inserted with br and horizontal rules with hr. Important text can be highlighted using strong for bold, em for emphasis,
           mark for highlighting, small for smaller text, and sub or sup for subscript or superscript. HTML supports links and navigation through the 
           a tag, and the nav element is used for navigation menus. Lists can be unordered with ul, ordered with ol, and each item is defined with li.
            Definition lists use dl with terms dt and descriptions dd. Multimedia elements include img for images, video for videos, audio for audio,
             and iframe for embedding external pages. Tables are created using table, with rows tr, header cells th, and data cells td. Sections of the 
             table can be defined with thead, tbody, and tfoot, while caption provides a table title. Forms are created using form, with inputs through input,
         multi-line text with textarea, dropdowns using select and option, buttons with button, and labels using label. HTML also includes semantic tags to give
          meaning to content, such as header for page headers, footer for footers, main for main content, section for sections, article for standalone articles, 
          aside for side content, and figure with figcaption for images with captions. Generic containers include div for block-level grouping and span for inline
           grouping. Scripts and styles can be added using script and style, while external CSS is linked with link. Metadata like charset, description, and keywords is handled using meta. Together, these tags allow developers to create structured, accessible, and interactive web pages.` },


    { title: " All HTML Tags: ", content: `<!DOCTYPE>, a, abbr, address, area, article, aside, audio, b, base, bdi, bdo, blockquote, body, 
        br, button, canvas, caption, cite, code, col, colgroup, data, datalist, dd, del, details, dfn, dialog, div, dl, dt, em, embed, fieldset, figcaption, 
        figure, footer, form, h1, h2, h3, h4, h5, h6, head, header, hr, html, i, iframe, img, input, ins, kbd, label, legend, li, link, main, map, mark, meta, 
        meter, nav, noscript, object, ol, optgroup, option, output, p, param, picture, pre, progress, q, rp, rt, ruby, s, samp, script, section, select, slot,
         small, source, span, strong, style, sub, summary, sup, table, tbody, td, template, textarea, tfoot, th, thead, time, title, tr, track, u, ul, var,
          video, wbr` },
    { title: "Resources", content: "MDN Web Docs, freeCodeCamp, W3Schools." },
  ],
  "JavaScript": [
    { title: "Overview", content: `JavaScript is a high-level, interpreted programming language that is primarily used to make web pages dynamic and interactive. While HTML provides the structure of a webpage and CSS handles its style, JavaScript adds behavior, allowing developers to respond to user actions such as clicks, typing, form submissions, and scrolling. It can manipulate the DOM (Document Object Model), enabling changes to content, structure, and style in real-time without reloading the page. Originally developed for client-side scripting, JavaScript now also runs on the server side with environments like Node.js, making it a versatile language for both front-end and back-end development. JavaScript supports object-oriented programming through objects and classes, as well as functional programming with functions as first-class citizens. Modern JavaScript (ES6 and later) includes features like arrow functions, template literals, modules, promises, and async/await for handling asynchronous operations efficiently. It has a lightweight, event-driven, and interpreted nature, which allows it to run in all modern browsers without compilation. JavaScript also works closely with APIs such as fetch for network requests, localStorage for client-side storage, and browser events for creating interactive experiences. Its widespread adoption makes it the core language of the web, used in everything from simple animations and form validations to complex single-page applications (SPAs) and server-side applications. Learning JavaScript is essential for web developers, as it bridges the gap between static content and interactive user experiences, providing the tools to build responsive, dynamic, and modern web applications. Overall, JavaScript is a versatile, powerful, and indispensable language in the modern web development ecosystem.` },
    { title: "Topics", content: `JavaScript provides several core concepts that every developer must understand. Variables are used to store data values, and with ES6, developers can use let, const, and var to declare variables with different scopes and mutability. Functions are reusable blocks of code that perform specific tasks, and JavaScript supports both traditional function declarations and modern arrow functions introduced in ES6. Loops allow developers to execute a block of code multiple times, such as for, while, and do...while loops, helping automate repetitive tasks. The DOM (Document Object Model) represents the structure of a web page, and JavaScript can access and manipulate HTML elements using methods like getElementById, querySelector, and addEventListener to create dynamic pages. Events are actions or occurrences that happen in the browser, such as clicks, keyboard inputs, or page loads, and JavaScript can respond to them with event handlers to make the webpage interactive. ES6, also known as ECMAScript 2015, introduced many modern features to JavaScript, including classes, template literals, modules, default parameters, destructuring, promises, and arrow functions, which make coding more efficient, readable, and maintainable. Together, understanding variables, functions, loops, DOM, events, and ES6 features forms the foundation of writing effective, interactive, and modern JavaScript code..` },
    { title: "Resources", content: "MDN, JS.info, freeCodeCamp." },
  ],
  "React": [
    { title: "Overview", content: `React is a JavaScript library created by Facebook for building dynamic, fast, and interactive user interfaces. Unlike traditional web development, React focuses on building reusable components, which are self-contained blocks of UI that can manage their own state and receive props from parent components. These components can be combined to create complex and maintainable applications. One of React’s main features is the virtual DOM, which efficiently updates only the parts of the webpage that change, improving performance and making applications highly responsive. React uses JSX, a syntax that allows developers to write HTML-like code directly within JavaScript, making it easier to read and manage UI structures. Modern React also introduces hooks, such as useState for managing component state, useEffect for handling side effects, and custom hooks that allow developers to reuse logic across components. React supports both functional and class components, but functional components with hooks are now the preferred approach. It can be used to build single-page applications (SPAs), mobile apps via React Native, and server-rendered applications with frameworks like Next.js. React also integrates well with other libraries and APIs, enabling developers to create scalable and modular applications. Its component-based architecture ensures better code reusability, easier maintenance, and faster development cycles. Learning React provides developers with the ability to create highly interactive, responsive, and modern web applications, making it one of the most popular and in-demand front-end libraries in the world. Overall, React simplifies the process of building complex user interfaces while maintaining performance and flexibility, which is why it has become a core tool in the toolkit of modern web developers.` },
    { title: "Topics", content: `In React, Components are the fundamental building blocks of any application. A component is a self-contained piece of UI that can render content, manage its own logic, and be reused across multiple parts of an application. Components can be functional or class-based, but modern React primarily encourages functional components combined with hooks for managing state and side effects. Props, short for properties, are used to pass data from a parent component to a child component, enabling dynamic rendering and component reusability. Props are read-only, meaning that a child component cannot modify the data received from its parent, which ensures unidirectional data flow and predictable application behavior. State represents a component’s internal data that can change over time. Unlike props, state is managed within the component itself, and any changes to state automatically trigger a re-render, allowing the UI to update dynamically in response to user interactions or other events. Hooks, introduced in React 16.8, are special functions that allow developers to use state and other React features in functional components. Common hooks include useState for managing state, useEffect for handling side effects like API calls or subscriptions, and custom hooks that allow sharing logic across components. For handling navigation in single-page applications, React uses React Router, a library that allows developers to define routes and render components based on the URL without refreshing the page. This makes creating multi-page experiences seamless and efficient. Finally, the Context API provides a way to share data across the component tree without having to pass props manually at every level. This is useful for global data such as user authentication, themes, or language settings, reducing prop-drilling and making state management simpler. Together, understanding Components, Props, State, Hooks, Router, and Context API gives developers the tools to build highly modular, interactive, and scalable React applications. Mastering these concepts is essential for creating modern web applications that are maintainable, efficient, and responsive to user interactions. By combining reusable components with state management, hooks, routing, and context, developers can deliver rich user experiences while keeping their code clean, organized, and flexible for future updates or scaling.` },
    { title: "Resources", content: "Official Docs, Scrimba, mini-projects." },
  ],
  "Node.js": [
    { title: "Overview", content: `Node.js is a JavaScript runtime environment that allows developers to run JavaScript code on the server side, outside of the browser. It is built on Chrome’s V8 engine, making it fast and efficient for building scalable network applications. One of the core features of Node.js is its modular architecture, where developers can use Modules to organize code into reusable files and import functionality using require or modern ES6 import/export syntax. Modules allow developers to separate concerns, maintain cleaner code, and reuse logic across different parts of an application. NPM (Node Package Manager) is an essential part of Node.js, providing access to thousands of third-party packages and libraries. Developers can install, manage, and update dependencies easily, which speeds up development and reduces the need to write everything from scratch. For building web servers and APIs, Express.js is the most popular framework used with Node.js. Express simplifies the process of creating routes, handling requests, and managing middleware, allowing developers to build robust web applications and RESTful APIs quickly. Node.js also provides built-in modules to interact with the File System (fs), enabling developers to read, write, update, and delete files on the server efficiently. This makes tasks such as logging, storing data, and managing configuration straightforward. Furthermore, Node.js excels in creating APIs, where it can handle multiple client requests asynchronously using its event-driven, non-blocking I/O model. This ensures that applications remain fast and responsive even under high traffic. By combining Modules, NPM, Express, File System operations, and API handling, Node.js provides developers with a powerful environment for building scalable, high-performance, and maintainable server-side applications. Understanding these core features is crucial for any developer looking to create modern backend services, real-time applications, and full-stack JavaScript projects. Node.js has become a foundational tool in the modern web development ecosystem due to its speed, flexibility, and vast ecosystem of packages and frameworks.` },
    { title: "Topics", content: `Modules, NPM, Express, File System, API.` },
    { title: "Resources", content: `Official Docs, Node School, TutorialsPoint.` },
  ],
  "Python": [
    { title: "Overview", content: `Python is a high-level, interpreted programming language known for its simplicity, readability, and versatility. Its syntax is clean and easy to understand, using indentation instead of braces to define code blocks, which makes it ideal for beginners as well as experienced developers. Python supports loops such as for and while, which allow repetitive tasks to be performed efficiently. It also provides control statements like break and continue to manage loop execution. Functions in Python are reusable blocks of code that perform specific tasks, helping developers write modular and maintainable code. Python supports both built-in functions and user-defined functions, and modern Python also allows the use of lambda expressions for creating anonymous functions. Object-Oriented Programming (OOP) is a key feature of Python, enabling developers to create classes, objects, inheritance, encapsulation, and polymorphism, which makes it easier to model real-world problems and build scalable applications. Python has a vast standard library and supports third-party libraries that provide additional functionality for tasks such as web development, data analysis, machine learning, automation, and more. Popular libraries include NumPy, Pandas, Matplotlib, TensorFlow, Flask, and Django. Python can be used in various domains including web development, data science, artificial intelligence, automation, and scientific computing. Its dynamic typing, interpreted nature, and cross-platform support make it a highly flexible and productive language. By mastering Python’s core features such as syntax, loops, functions, OOP, and libraries, developers can create efficient, maintainable, and powerful applications across different fields. Python’s ease of learning, combined with its rich ecosystem, has made it one of the most popular programming languages in the world, suitable for beginners as well as professionals building advanced applications.` },
    { title: "Topics", content: `Syntax, Loops, Functions, OOP, Libraries.` },
    { title: "Resources", content: "Python Docs, W3Schools, GeeksforGeeks." },
  ],
  // Add more skills similarly
};

const Mcontent = () => {
  const { skillName, page } = useParams();
  const navigate = useNavigate();
  const decodedSkill = decodeURIComponent(skillName);
  const pageIndex = parseInt(page, 10) - 1;
  const skillData = skillPages[decodedSkill];

  if (!skillData) return <p style={{ textAlign: "center", padding: "50px" }}>Skill not found!</p>;

  return (
    <div style={{ padding: "50px", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h2>{skillData[pageIndex].title}</h2>
      <p style={{ fontSize: "18px", lineHeight: "1.6" }}>{skillData[pageIndex].content}</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
        <button
          onClick={() => navigate(`/StudentsPortal/skill/${encodeURIComponent(decodedSkill)}/${pageIndex}`)}
          disabled={pageIndex === 0}
          style={{
            padding: "10px 20px",
            borderRadius: "50px",
            backgroundColor: pageIndex === 0 ? "#ccc" : "#4D96FF",
            color: "#fff",
            border: "none",
            cursor: pageIndex === 0 ? "default" : "pointer",
          }}
        >
          Previous
        </button>
        <button
          onClick={() => navigate(`/StudentsPortal/skill/${encodeURIComponent(decodedSkill)}/${pageIndex + 2}`)}
          disabled={pageIndex === skillData.length - 1}
          style={{
            padding: "10px 20px",
            borderRadius: "50px",
            backgroundColor: pageIndex === skillData.length - 1 ? "#ccc" : "#4D96FF",
            color: "#fff",
            border: "none",
            cursor: pageIndex === skillData.length - 1 ? "default" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Mcontent;