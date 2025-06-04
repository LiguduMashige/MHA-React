import React from 'react';
import '../styles/Reflection.css';
import { motion } from 'framer-motion';

const Reflection = () => {
  return (
    <motion.div 
      className="reflection-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="reflection-title">Reflection</h1>

      <section className="reflection-section">
        <h2>What I Enjoyed</h2>
        <p>
          I really enjoyed creating a body of work that reflects both my mother's craft and my own. 
          This project felt personal and meaningful—it wasn't just an assignment but something 
          that combined our passions. I looked forward to working on it because I knew it would 
          act as a starting point or insight into my final Digital Arts project. That motivated 
          me to step out of my comfort zone, especially when it came to coding.
        </p>
        <p>
          Although I usually struggle with adapting to new concepts, I found it particularly 
          interesting that routing and breaking down the site into components came quite naturally 
          to me. Understanding how each page consists of multiple components really helped make 
          the process more manageable. This felt like a strength I didn't know I had.
        </p>
        <p>
          I also thoroughly enjoyed applying the lessons we covered in class. The authentication 
          lecture and the Netflix tutorial were especially helpful. Surprisingly, the hardest part 
          for me was implementing my dream design visually. However, the Netflix project helped 
          a lot—especially with the modal view, which I was able to adapt for product details on my site.
        </p>
      </section>

      <section className="reflection-section">
        <h2>What I Didn't Implement</h2>
        <p>
          There are a few features I didn't manage to include, most notably the "sort by" and "filter" 
          buttons that I had in my design document. Although my homepage is styled nicely and is 
          user-friendly, I realized later that those buttons are important for accessibility and 
          better user experience.
        </p>
        <p>
          Another feature I left out was the personalization page that was supposed to appear once 
          a user logs in. The reason for this is that the favourites function already offers a way 
          for users to tailor their experience. Without an explore page, a separate personalization 
          page felt redundant. I initially considered including an explore page, but it would have 
          required pulling external data from an API. I chose not to go that route because I wanted 
          to stay true to my theme—highlighting my mother's candle business. Instead, I created 
          custom data for products like furniture and lamps, which she plans to add to her business 
          in the future.
        </p>
      </section>

      <section className="reflection-section">
        <h2>What I Did Well</h2>
        <p>
          One of the biggest strengths of this project was how much focus I placed on structure. 
          The site feels cohesive and flows really well from one section to another. I'm especially 
          proud of the homepage, which displays the products beautifully and gives off an elegant, 
          warm atmosphere using nude tones and a clean font that matches the brand.
        </p>
        <p>
          My favourite feature is definitely the modal view for the products. Drawing inspiration 
          from design elements of Netflix and Airbnb, I was able to give the site an interactive, 
          user-friendly feel that's still simple and easy to scroll through.
        </p>
        <p>
          Initially, I had planned to create multiple individual product pages, but I realized that 
          having everything on the homepage—organized by category—was more efficient. It simplifies 
          the navigation for the user, and the modal view makes exploring each item seamless. I also 
          adapted the navigation bar to be less overwhelming, which made the experience smoother.
        </p>
        <p>
          Additionally, I created a Services page, which acts as an explore section. It gives users 
          insight into the services and tips that the company provides—something I felt was a thoughtful 
          and valuable addition.
        </p>
      </section>
    </motion.div>
  );
};

export default Reflection;
