// @ts-nocheck
'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavBar } from '../../components';

const learnArticles = [
  // ===== STAGE 1: BRAINSTORM =====
  {
    id: 'what-to-sell',
    title: 'What Should I Sell?',
    emoji: '💡',
    category: '1. Brainstorm',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Not sure what to sell? Here are fun ways to figure out what YOUR perfect product is.',
    content: [
      { type: 'intro', text: "Every business starts with one question: what should I sell? The best answer is something YOU love making that OTHER people want to buy." },
      { type: 'heading', text: 'Start With What You Love' },
      { type: 'text', text: "What do you do for fun? Draw? Bake? Build things? Make bracelets? The best products come from things you already enjoy doing. When you love making something, it shows in the quality!" },
      { type: 'heading', text: 'Ask Around' },
      { type: 'text', text: "Talk to friends, family, and neighbors. Ask them: What would you buy from a kid's store? What do you wish someone made? Their answers might surprise you!" },
      { type: 'example', text: 'Your neighbor says: "I wish someone sold homemade dog treats." You love dogs. Boom. Business idea!' },
      { type: 'heading', text: 'The 3-Question Test' },
      { type: 'text', text: "For every idea, ask yourself three questions. Do I enjoy making this? Can I make it again and again? Would someone pay money for it? If you answer yes to all three, you have a winner." },
      { type: 'tip', text: "Start with ONE product. You can always add more later. It's better to be great at one thing than okay at five things." },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Product', definition: 'The thing you make and sell' },
      { type: 'vocab', term: 'Market', definition: 'The people who might buy your product' },
    ],
  },
  {
    id: 'great-product',
    title: 'What Makes a Great Product?',
    emoji: '⭐',
    category: '1. Brainstorm',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Learn what separates a good product from a GREAT one that people love.',
    content: [
      { type: 'intro', text: "Anyone can make something. But making something people LOVE? That takes a little extra thought." },
      { type: 'heading', text: 'Make It Well' },
      { type: 'text', text: "Quality matters. If you sell painted rocks, make sure the paint is smooth and the colors pop. If you sell cookies, make sure they taste amazing every single time. People come back when they trust your quality." },
      { type: 'heading', text: 'Make It Special' },
      { type: 'text', text: "What makes YOUR product different from something you could buy at a store? Maybe it's handmade. Maybe you use special colors. Maybe you take custom orders. Find your special thing." },
      { type: 'example', text: 'Two kids sell bracelets. One sells plain ones. The other lets you pick your own colors and adds your name. The second one sells way more. That\'s the power of being special!' },
      { type: 'heading', text: 'Solve a Problem' },
      { type: 'text', text: "The best products fix something. A bookmark solves the problem of losing your page. A snack bag solves the problem of being hungry. Think about what little problems your product can solve." },
      { type: 'tip', text: 'Ask someone who bought from you: "What do you like best about it?" Their answer tells you your superpower.' },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Quality', definition: 'How well something is made' },
      { type: 'vocab', term: 'Unique', definition: 'One of a kind. Special. Different from everyone else.' },
    ],
  },
  // ===== STAGE 2: PLAN =====
  {
    id: 'business-plan',
    title: 'Making a Simple Business Plan',
    emoji: '📋',
    category: '2. Plan',
    difficulty: 'Beginner',
    readTime: '4 min',
    summary: 'A plan helps you stay organized and reach your goals. Here is how to make one!',
    content: [
      { type: 'intro', text: "A business plan sounds fancy, but it's really just answering four simple questions. Even big companies start this way!" },
      { type: 'heading', text: 'Question 1: What am I selling?' },
      { type: 'text', text: 'Write down your product. Be specific! Not just "crafts" but "friendship bracelets in 6 different color combos." The more specific, the better.' },
      { type: 'heading', text: 'Question 2: Who will buy it?' },
      { type: 'text', text: "Think about your customers. Are they kids at school? Parents in your building? Neighbors? Knowing who you are selling to helps you make better decisions." },
      { type: 'heading', text: 'Question 3: How much will I charge?' },
      { type: 'text', text: "Add up what it costs to make your product, then add your profit on top. We have a whole lesson on pricing!" },
      { type: 'heading', text: 'Question 4: What is my goal?' },
      { type: 'text', text: "Why are you doing this? Saving for something? Learning new skills? Just for fun? Having a goal keeps you going when things get hard." },
      { type: 'example', text: "Here is a real plan: I sell painted rocks ($4 each) to neighbors in my building. I want to save $80 for a skateboard. That means I need to sell 20 rocks." },
      { type: 'tip', text: "Write your plan down! Even on a sticky note. Having it written makes it real." },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Business Plan', definition: 'A simple list of what you sell, who buys it, and what your goal is' },
      { type: 'vocab', term: 'Goal', definition: 'What you are working toward' },
    ],
  },
  {
    id: 'pricing-101',
    title: 'How to Pick the Right Price',
    emoji: '💰',
    category: '2. Plan',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Learn how to figure out what to charge so you make money and customers feel happy!',
    content: [
      { type: 'intro', text: "Picking a price can feel tricky. Too high and nobody buys. Too low and you don't make enough. Here is how to find the sweet spot." },
      { type: 'heading', text: 'Step 1: Figure Out What It Costs You' },
      { type: 'text', text: 'Before you set a price, add up everything you spend to make your product. If you make bracelets, that means the beads, the string, and anything else you buy. This is called your "cost."' },
      { type: 'example', text: "If beads cost $1 and string costs $0.50, your cost is $1.50 per bracelet." },
      { type: 'heading', text: 'Step 2: Add Your Profit' },
      { type: 'text', text: "Profit is the money you keep after paying for supplies. You need to charge MORE than your cost. A good starting point is to double your cost." },
      { type: 'example', text: "Cost = $1.50. Price = $3.00. Profit = $1.50 per bracelet!" },
      { type: 'heading', text: 'Step 3: Check What Others Charge' },
      { type: 'text', text: "Look at what other kids or stores charge for similar things. If everyone sells bracelets for $5, you could price yours at $4 to get more buyers, or $6 if yours are extra special." },
      { type: 'tip', text: 'Ask a friend: "Would you pay $3 for this?" If they say yes right away, your price might even be too low!' },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Cost', definition: 'How much you spend to make something' },
      { type: 'vocab', term: 'Profit', definition: 'The money you keep after paying your costs' },
      { type: 'vocab', term: 'Price', definition: 'What you charge your customer' },
    ],
  },
  {
    id: 'profit-margin',
    title: 'Am I Actually Making Money?',
    emoji: '🧮',
    category: '2. Plan',
    difficulty: 'Intermediate',
    readTime: '4 min',
    summary: 'Selling stuff is fun, but are you really making money? Learn how to check!',
    content: [
      { type: 'intro', text: "Just because money comes in doesn't mean you're making a profit. Here is how to figure out if your business is really making money!" },
      { type: 'heading', text: 'Money In vs. Money You Keep' },
      { type: 'text', text: "Revenue is ALL the money that comes in from sales. Profit is what's LEFT after you pay for your supplies. They're not the same thing!" },
      { type: 'example', text: "You sold 10 bracelets for $5 each. Revenue = $50. But beads and string cost $20. Profit = $50 - $20 = $30!" },
      { type: 'heading', text: 'What Is a Margin?' },
      { type: 'text', text: "Margin tells you how much of each dollar you get to keep. If you sell something for one dollar and keep 60 cents, your margin is 60 percent. The bigger that number, the more money you are making." },
      { type: 'example', text: "You sell for $5, it costs $2 to make. Profit = $3. Margin = $3 / $5 = 60%. That means you keep 60 cents of every dollar!" },
      { type: 'tip', text: "A margin above 50% is great for a kid's business. If yours is below 30%, think about raising your price or finding cheaper supplies." },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Revenue', definition: 'All the money that comes in when you sell things' },
      { type: 'vocab', term: 'Profit', definition: 'Money left over after paying for supplies' },
      { type: 'vocab', term: 'Margin', definition: 'How much of each dollar you sell is money you keep' },
    ],
  },
  // ===== STAGE 3: BUILD =====
  {
    id: 'store-stand-out',
    title: 'Making Your Store Stand Out',
    emoji: '🎨',
    category: '3. Build',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Your store is your brand! Learn how to make it look amazing and feel like YOU.',
    content: [
      { type: 'intro', text: 'Picture someone visiting your store for the first time. You want them to think "Wow, this is cool!" Your store design is the first thing people see, so let\'s make it great.' },
      { type: 'heading', text: 'Pick a Color That Fits' },
      { type: 'text', text: "Colors make people feel things. Bright yellow feels happy and fun. Blue feels calm and safe. Pink feels creative and playful. Pick a color that matches the vibe of your products." },
      { type: 'heading', text: 'Choose a Fun Font' },
      { type: 'text', text: 'The font you pick for your store name shows what your store is all about. A bubbly font says "fun and playful." A clean font says "I mean business." Pick one that matches your brand!' },
      { type: 'heading', text: 'Write a Great Bio' },
      { type: 'text', text: "Tell people who you are in 1-2 sentences. Include what you sell and what makes it special. Be yourself." },
      { type: 'example', text: 'Good bio: "Hi! I\'m Emma and I make one-of-a-kind bracelets with cool patterns. Every one is different!"' },
      { type: 'heading', text: 'Add a Banner Photo' },
      { type: 'text', text: "A banner image at the top of your store makes it look polished and real. Take a photo of your products laid out nicely, or your workspace where you make things." },
      { type: 'tip', text: "Look at your favorite stores. What do you like about how they look? Use those ideas for your own store!" },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Brand', definition: 'The look, name, and feeling that makes people remember your store' },
      { type: 'vocab', term: 'Bio', definition: 'A short description about you or your store' },
    ],
  },
  {
    id: 'great-photos',
    title: 'Taking Great Product Photos',
    emoji: '📸',
    category: '3. Build',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Good photos make people want to buy. Learn easy tricks to take awesome pictures!',
    content: [
      { type: 'intro', text: "People can't touch or hold your product online. They can only see a photo. A great photo can be what makes someone buy instead of skip!" },
      { type: 'heading', text: 'Use Natural Light' },
      { type: 'text', text: "Take photos near a window during the day. Sunlight makes colors look real and bright. Avoid using flash because it makes things look flat and weird." },
      { type: 'heading', text: 'Keep the Background Simple' },
      { type: 'text', text: "Put your product on a clean, plain surface. A white table, a piece of paper, or a wooden board all work great. You want people to look at your product, not the stuff behind it." },
      { type: 'heading', text: 'Show the Best Angle' },
      { type: 'text', text: "Try taking photos from different angles. Straight on, from above, from the side. See which one makes your product look the best!" },
      { type: 'example', text: "For bracelets, try laying them flat and shooting from above. For baked goods, get close up and shoot from a slight angle so you can see the texture." },
      { type: 'heading', text: 'Hold Steady!' },
      { type: 'text', text: "Blurry photos look bad. Hold your phone with both hands, or lean it against something. Take 5 photos and pick the best one." },
      { type: 'tip', text: "Look at how products are shown on Amazon or Etsy. They use white backgrounds and close-up shots. You can do the same thing at home!" },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Product Photo', definition: 'A picture that shows off what you sell' },
      { type: 'vocab', term: 'Background', definition: 'What is behind your product in the photo' },
    ],
  },
  // ===== STAGE 4: LAUNCH =====
  {
    id: 'marketing-basics',
    title: 'Tell People About Your Store!',
    emoji: '📣',
    category: '4. Launch',
    difficulty: 'Beginner',
    readTime: '4 min',
    summary: 'Your store is awesome, but people need to know it exists! Here are easy ways to spread the word.',
    content: [
      { type: 'intro', text: "You made great products and set up your store. But how do people find out about it? That is called marketing." },
      { type: 'heading', text: 'What Is Marketing?' },
      { type: 'text', text: "Marketing just means telling people about what you sell. Big companies spend millions on it, but you can do it for free." },
      { type: 'heading', text: 'Way #1: Word of Mouth' },
      { type: 'text', text: "Tell your friends, family, and neighbors about your store. This is the oldest and best way to get customers. When someone buys from you and loves it, they'll tell other people too." },
      { type: 'tip', text: "Make it easy: share your store link with your parents so they can text it to other families." },
      { type: 'heading', text: 'Way #2: Make a Sign or Flyer' },
      { type: 'text', text: "Draw a cool poster or flyer and ask if you can put it up in your building lobby, school, or local coffee shop. Include your store name and what you sell." },
      { type: 'heading', text: 'Way #3: Show Off Your Work' },
      { type: 'text', text: "Wear your jewelry, bring your cookies to a playdate, or give a small sample to a neighbor. When people see or taste your product, they're more likely to buy!" },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Marketing', definition: 'Telling people about what you sell' },
      { type: 'vocab', term: 'Word of Mouth', definition: 'When happy customers tell their friends about you' },
    ],
  },
  {
    id: 'first-customer',
    title: 'Your First Customer!',
    emoji: '🎉',
    category: '4. Launch',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Getting your first sale is a big deal! Here is what to expect and how to make it great.',
    content: [
      { type: 'intro', text: "Your first sale is one of the most exciting moments in business. Even the biggest companies in the world remember their first customer." },
      { type: 'heading', text: 'Be Ready' },
      { type: 'text', text: "Before you get your first order, make sure you are prepared. Do you have your product ready? Do you know how to deliver it? Talk to your parent about the plan." },
      { type: 'heading', text: 'Be Excited (But Not Nervous)' },
      { type: 'text', text: "It's totally normal to feel a little nervous. That's just excitement in disguise! Your customer already decided they want what you are selling. They are rooting for you." },
      { type: 'heading', text: 'Deliver With Care' },
      { type: 'text', text: "When you hand over your product, make it special. Wrap it nicely if you can. Say thank you. A little thank-you note goes a long way!" },
      { type: 'example', text: 'Write a quick note: "Thanks for being my first customer! I hope you love your bracelet. -Emma"' },
      { type: 'heading', text: 'Ask What They Think' },
      { type: 'text', text: "After a day or two, ask your customer if they like it. Their feedback helps you get better. And if they love it, ask them to tell a friend!" },
      { type: 'tip', text: "Take a mental picture of this moment. You just made your first sale. That is something most people never do." },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'First Sale', definition: 'The very first time someone pays for your product' },
      { type: 'vocab', term: 'Feedback', definition: 'What customers tell you about their experience' },
    ],
  },
  {
    id: 'supply-demand',
    title: 'Why Some Things Sell Fast',
    emoji: '📈',
    category: '4. Launch',
    difficulty: 'Intermediate',
    readTime: '4 min',
    summary: 'Ever wonder why some products fly off the shelf? It comes down to supply and demand!',
    content: [
      { type: 'intro', text: "Some days everything sells out. Other days, nothing. Why? It has to do with two big ideas: supply and demand." },
      { type: 'heading', text: 'What Is Demand?' },
      { type: 'text', text: "Demand is how many people WANT to buy something. If everyone in your class wants a friendship bracelet, demand is high. If nobody wants one, demand is low." },
      { type: 'heading', text: 'What Is Supply?' },
      { type: 'text', text: "Supply is how much of something is available. If you can only make 5 bracelets a week, that's your supply." },
      { type: 'heading', text: 'The Magic Rule' },
      { type: 'text', text: "When lots of people want something but there isn't much of it, you can charge more. When there's tons of something but nobody wants it, you have to charge less." },
      { type: 'example', text: "It's summer and hot outside. Lemonade demand is HIGH. You can charge $3 a cup! In winter, demand drops and you might need to charge $1." },
      { type: 'tip', text: 'Pay attention to what people are asking for. If 5 people ask "Do you sell stickers?" that\'s demand telling you to make stickers!' },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Demand', definition: 'How many people want to buy something' },
      { type: 'vocab', term: 'Supply', definition: 'How much of something is available to sell' },
    ],
  },
  // ===== STAGE 5: GROW =====
  {
    id: 'customer-service',
    title: 'Making Customers Happy',
    emoji: '😊',
    category: '5. Grow',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Happy customers come back and tell their friends. Learn how to give great service!',
    content: [
      { type: 'intro', text: "The sale is not over once someone buys from you. How you treat your customers after they buy is just as important." },
      { type: 'heading', text: 'Why Does It Matter?' },
      { type: 'text', text: "A happy customer will buy from you again AND tell their friends about you. An unhappy customer won't come back and might tell others to skip your store too." },
      { type: 'heading', text: 'The Golden Rules' },
      { type: 'text', text: "1. Always be friendly and say thank you.\n2. If something goes wrong, fix it quickly and kindly.\n3. Deliver what you promised. If you said chocolate chip cookies, they better be chocolate chip.\n4. Ask your customers what they think. Their ideas help you get better." },
      { type: 'tip', text: "Write a little thank-you note and include it with your product. It makes people smile and remember your store!" },
      { type: 'heading', text: 'What If Someone Is Unhappy?' },
      { type: 'text', text: "Don't panic! Listen to what they say, say you're sorry, and try to make it right. Maybe offer a replacement or a discount on their next order. Fixing a problem well can turn an unhappy customer into your biggest fan." },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Customer Service', definition: 'How you treat the people who buy from you' },
      { type: 'vocab', term: 'Repeat Customer', definition: 'Someone who buys from you more than once' },
    ],
  },
  {
    id: 'reviews-ratings',
    title: 'Getting Great Reviews',
    emoji: '⭐',
    category: '5. Grow',
    difficulty: 'Beginner',
    readTime: '3 min',
    summary: 'Reviews help new customers trust your store. Learn how to earn 5-star ratings!',
    content: [
      { type: 'intro', text: "Think about when you shop online. Do you look at the stars and reviews? Your customers do too! Here is how you earn great reviews." },
      { type: 'heading', text: 'Why Reviews Matter' },
      { type: 'text', text: 'Reviews are like a report card for your store. When new people see 5 stars and nice comments, they feel safe buying from you. People trust what other people say. So good reviews help new customers feel safe buying from you.' },
      { type: 'heading', text: 'How to Get Good Reviews' },
      { type: 'text', text: "1. Make a great product. That is the most important thing.\n2. Be nice and helpful to every customer.\n3. After someone buys, ask them nicely to leave a review.\n4. If someone has a problem, fix it before they leave a bad review." },
      { type: 'tip', text: "Don't be scared of a bad review. One or two is normal. What matters is how you respond. Be kind and try to fix it!" },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Review', definition: 'What a customer writes about their experience' },
      
    ],
  },
  {
    id: 'growing-product-line',
    title: 'Growing Your Product Line',
    emoji: '🚀',
    category: '5. Grow',
    difficulty: 'Intermediate',
    readTime: '4 min',
    summary: 'Ready to sell more stuff? Learn how to add new products the smart way.',
    content: [
      { type: 'intro', text: "Your first product is doing well. Now you are thinking: what else could I sell? Adding new products is exciting, but you want to do it the smart way." },
      { type: 'heading', text: 'Listen to Your Customers' },
      { type: 'text', text: 'Your best ideas for new products will come from the people who already buy from you. If three people ask "Do you sell earrings too?" that is a sign you should try making earrings!' },
      { type: 'heading', text: 'Stick to What You Know' },
      { type: 'text', text: "If you sell bracelets, earrings make sense as a new product. Jumping from bracelets to baked goods is a bigger leap. Start with products that are close to what you already make." },
      { type: 'example', text: "Mia sells painted flower pots. She adds matching garden markers using the same paint. Her customers love them because the style matches." },
      { type: 'heading', text: 'Test Before You Go Big' },
      { type: 'text', text: "Make a small batch (just a few) of your new product first. Sell a few and see how people react. If they love it, make more! If not, try something else. This saves you time and money." },
      { type: 'heading', text: "Don't Do Too Much at Once" },
      { type: 'text', text: "It is tempting to add 10 new products at once. But that is hard to manage and your quality might drop. Add one new product at a time and do it well." },
      { type: 'tip', text: 'Every time you add a new product, update your announcement bar to let people know! "NEW: Matching earrings now available!"' },
      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Product Line', definition: 'All the different things you sell' },
      { type: 'vocab', term: 'Test', definition: 'Trying something small before going big' },
      { type: 'vocab', term: 'Expand', definition: 'Adding new products to your store' },
    ],
  },
  {
    id: '50-business-ideas',
    title: '50 Products You Can Make and Sell',
    emoji: '💡',
    category: '1. Brainstorm',
    difficulty: 'Beginner',
    readTime: '8 min',
    summary: 'Not sure what to make? Here are 50 real products kids can create and sell for under $50 to start!',
    content: [
      { type: 'intro', text: "You don't need a lot of money to start a real business. Every idea on this list is something you can MAKE and SELL for under $50 to get started. Pick one that sounds fun and give it a try!" },

      { type: 'heading', text: '🎨 Arts & Crafts' },
      { type: 'text', text: "If you love making things with your hands, these are for you." },
      { type: 'ideas', items: [
        { num: 1, name: 'Friendship bracelets', cost: '$10 to start', price: '$3-5 each', desc: 'Beads and string. Endless color combos!' },
        { num: 2, name: 'Painted rocks', cost: '$8 for paint', price: '$2-4 each', desc: 'Collect rocks for free. Paint animals, words, or patterns.' },
        { num: 3, name: 'Custom bookmarks', cost: '$5 for supplies', price: '$1-2 each', desc: 'Cardstock and markers. Great for book lovers!' },
        { num: 4, name: 'Handmade greeting cards', cost: '$5 for supplies', price: '$2-4 each', desc: 'Way more special than store-bought.' },
        { num: 5, name: 'Sticker designs', cost: '$12 for sticker paper', price: '$3-5 per pack', desc: 'Draw your own designs and print them.' },
        { num: 6, name: 'Keychains', cost: '$10 to start', price: '$3-6 each', desc: 'Beads, charms, and keychain rings. Tons of styles!' },
        { num: 7, name: 'Painted flower pots', cost: '$1 per pot + paint', price: '$5-8 each', desc: 'Plain pots become works of art.' },
        { num: 8, name: 'Custom name signs', cost: '$5 for supplies', price: '$5-10 each', desc: 'Wood scraps, paint, and glitter.' },
        { num: 9, name: 'Origami art', cost: 'Almost free!', price: '$1-3 each', desc: 'Paper is all you need. Cranes, flowers, and animals.' },
        { num: 10, name: 'Pressed flower frames', cost: '$5 for frames', price: '$5-8 each', desc: 'Collect flowers, press them, frame them.' },
        { num: 11, name: 'Paperweights', cost: '$8 for supplies', price: '$3-6 each', desc: 'Smooth rocks with paint, glitter, or paper cutouts glued on.' },
        { num: 12, name: 'Beaded suncatchers', cost: '$10 to start', price: '$4-7 each', desc: 'Wire, beads, and fishing line. They sparkle in windows.' },
        { num: 13, name: 'Woven potholders', cost: '$8 for a loom', price: '$3-5 each', desc: 'Colorful and useful. People love handmade kitchen stuff.' },
        { num: 14, name: 'Clay magnets', cost: '$8 for clay', price: '$2-4 each', desc: 'Air-dry clay in fun shapes with magnets on the back.' },
      ] },

      { type: 'heading', text: '🍪 Food & Treats' },
      { type: 'text', text: "People love homemade food. Always have a parent help in the kitchen and check about food rules in your area." },
      { type: 'ideas', items: [
        { num: 15, name: 'Lemonade', cost: '$10-15 to start', price: '$1-3 per cup', desc: 'The classic kid business!' },
        { num: 16, name: 'Cookies', cost: '$5 per batch', price: '$1-2 each', desc: 'Everyone loves homemade cookies.' },
        { num: 17, name: 'Rice crispy treats', cost: '$3 per batch', price: '$1-2 each', desc: 'Super cheap to make, kids love them.' },
        { num: 18, name: 'Trail mix bags', cost: '$10 for bulk ingredients', price: '$2-3 per bag', desc: 'Mix your own custom combos.' },
        { num: 19, name: 'Hot cocoa kits', cost: '$10 for supplies', price: '$4-6 each', desc: 'Jars with cocoa mix, marshmallows, and a candy cane.' },
        { num: 20, name: 'Flavored popcorn', cost: '$5 to start', price: '$2-3 per bag', desc: 'Cinnamon sugar, cheese, or caramel flavors.' },
        { num: 21, name: 'Dog treats', cost: '$8 for ingredients', price: '$3-5 per bag', desc: 'Peanut butter, oats, and banana. Dogs go crazy for them.' },
        { num: 22, name: 'Fruit popsicles', cost: '$8 for molds', price: '$1-2 each', desc: 'Blend fruit and freeze. Perfect for summer!' },
        { num: 23, name: 'Decorated sugar cookies', cost: '$8 for supplies', price: '$2-3 each', desc: 'Plain cookies plus frosting and sprinkles.' },
        { num: 24, name: 'Homemade granola', cost: '$8 for ingredients', price: '$5-7 per jar', desc: 'Oats, honey, and your favorite mix-ins.' },
        { num: 25, name: 'Cake pops', cost: '$10 for supplies', price: '$2-3 each', desc: 'Crumbled cake on sticks with sprinkles.' },
        { num: 26, name: 'Banana bread loaves', cost: '$4 per batch', price: '$5-6 per mini loaf', desc: 'Smells amazing. Sells even better.' },
      ] },

      { type: 'heading', text: '🌱 Nature & Garden' },
      { type: 'text', text: "Love being outside? These businesses start in your backyard." },
      { type: 'ideas', items: [
        { num: 27, name: 'Potted plant babies', cost: 'Almost free!', price: '$3-5 each', desc: 'Split baby plants from ones you already have.' },
        { num: 28, name: 'Seed starter kits', cost: '$8 for supplies', price: '$4-6 per kit', desc: 'Small pots, soil, seeds, and instructions.' },
        { num: 29, name: 'Flower bouquets', cost: '$2 for seed packets', price: '$5-8 per bouquet', desc: 'Grow them yourself and sell fresh bundles.' },
        { num: 30, name: 'Painted garden markers', cost: '$5 for supplies', price: '$3-5 per set', desc: 'Rocks or popsicle sticks labeled with plant names.' },
        { num: 31, name: 'Bug hotel kits', cost: '$3 for supplies', price: '$5-8 each', desc: 'Sticks, pinecones, and a box. Fun and educational.' },
        { num: 32, name: 'Herb growing kits', cost: '$8 for supplies', price: '$4-6 per kit', desc: 'Basil, mint, or cilantro. People love fresh herbs.' },
        { num: 33, name: 'Fairy garden supplies', cost: '$10 for supplies', price: '$6-10 per kit', desc: 'Tiny doors, mini mushrooms, pebble paths.' },
        { num: 34, name: 'Dried flower bouquets', cost: 'Almost free!', price: '$5-8 each', desc: 'Hang flowers to dry, arrange in bundles. They last forever.' },
        { num: 35, name: 'Terrarium kits', cost: '$12 for supplies', price: '$8-12 each', desc: 'Small jars with pebbles, soil, moss, and tiny plants.' },
        { num: 36, name: 'Nature journals', cost: '$5 for supplies', price: '$3-5 each', desc: 'Press leaves, draw insects, label everything.' },
      ] },

      { type: 'heading', text: '🎁 Seasonal & Holiday' },
      { type: 'text', text: "These products sell best at certain times of year. Plan ahead!" },
      { type: 'ideas', items: [
        { num: 37, name: 'Holiday ornaments', cost: '$10 for supplies', price: '$3-6 each', desc: 'Huge demand in November and December.' },
        { num: 38, name: "Valentine's Day cards", cost: '$5 for supplies', price: '$3-5 per pack', desc: 'Handmade valentines in February.' },
        { num: 39, name: 'Back-to-school pencil cases', cost: '$8 for supplies', price: '$4-6 each', desc: 'Decorate plain pouches with fabric paint.' },
        { num: 40, name: 'Summer activity kits', cost: '$15 for supplies', price: '$8-12 per box', desc: 'Outdoor games, chalk, bubbles in a bag.' },
        { num: 41, name: 'Custom party favors', cost: '$10 for supplies', price: '$10-15 per pack', desc: 'Themed favor bags for birthday parties.' },
        { num: 42, name: 'Halloween treat bags', cost: '$8 for supplies', price: '$3-5 each', desc: 'Decorated bags filled with candy or toys.' },
        { num: 43, name: "Mother's Day gift boxes", cost: '$12 for supplies', price: '$8-12 each', desc: 'A candle, card, and small craft in a box.' },
      ] },

      { type: 'heading', text: '🧶 Wearable & Useful' },
      { type: 'text', text: "Make things people can actually use every day." },
      { type: 'ideas', items: [
        { num: 44, name: 'Tie-dye shirts', cost: '$15 for kit + shirts', price: '$10-15 each', desc: 'Every shirt comes out different.' },
        { num: 45, name: 'Scrunchies', cost: 'Almost free!', price: '$2-4 each', desc: 'Fabric scraps and elastic. So many patterns to try.' },
        { num: 46, name: 'Tote bags', cost: '$3 per blank bag', price: '$8-12 each', desc: 'Paint or stamp your own designs on canvas.' },
        { num: 47, name: 'Lip balm', cost: '$12 for supplies', price: '$2-4 each', desc: 'Beeswax and coconut oil in small tins. Ask a parent to help melt it.' },
        { num: 48, name: 'Bath bombs', cost: '$10 for supplies', price: '$3-5 each', desc: 'Baking soda, citric acid (ask a parent), and scented oils.' },
        { num: 49, name: 'Beeswax wraps', cost: '$15 for supplies', price: '$5-8 each', desc: 'Reusable food wraps. Good for the planet too.' },
        { num: 50, name: 'Coasters', cost: '$5 for tiles', price: '$8-10 per set of 4', desc: 'Paint or decoupage on hardware store tiles.' },
      ] },

      { type: 'tip', text: "Don't try to do all 50! Pick ONE idea that sounds fun, start small, and see how it goes. You can always try a different one later." },

      { type: 'heading', text: 'How to Pick YOUR Idea' },
      { type: 'text', text: "Ask yourself: which idea sounds the most FUN? Which one can I start THIS WEEK? And who in my neighborhood would buy it? The best business is one you are excited about. Pick the one that makes you say 'I want to try that' and just go for it." },

      { type: 'heading', text: 'Key Words You Learned' },
      { type: 'vocab', term: 'Startup Cost', definition: 'The money you need to spend before you can start selling' },
      { type: 'vocab', term: 'Handmade', definition: 'Made by hand, not by a machine. This is your superpower!' },
      { type: 'vocab', term: 'Seasonal', definition: 'Something that sells best at a certain time of year' },
      { type: 'vocab', term: 'Batch', definition: 'A group of products you make all at once' },
    ],
  },
];

export default function ArticlePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const article = learnArticles.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-4">We couldn't find that article.</p>
          <Link href="/learn" className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg">Back to Learn</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar active="learn" />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-4">
        <Link href="/learn" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-2">
          <span>←</span>
          <span className="text-sm font-medium">Back to Learn</span>
        </Link>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-50 text-amber-700">{article.category.replace(/^\d+\.\s*/, '')}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">{article.difficulty}</span>
            <span className="text-xs text-gray-400">{article.readTime} read</span>
          </div>
          <div className="text-4xl mb-3">{article.emoji}</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{article.title}</h1>
          <p className="text-gray-500">{article.summary}</p>
        </div>

        <div className="space-y-4">
          {article.content.map((block, i) => {
            if (block.type === 'intro') return (
              <p key={i} className="text-gray-600 text-lg leading-relaxed border-l-4 border-amber-300 pl-4">{block.text}</p>
            );
            if (block.type === 'heading') return (
              <h2 key={i} className="text-lg font-bold text-gray-800 mt-6">{block.text}</h2>
            );
            if (block.type === 'text') return (
              <p key={i} className="text-gray-600 leading-relaxed whitespace-pre-line">{block.text}</p>
            );
            if (block.type === 'example') return (
              <div key={i} className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="text-xs font-semibold text-amber-700 mb-1">📝 Example</div>
                <p className="text-amber-900 text-sm whitespace-pre-line">{block.text}</p>
              </div>
            );
            if (block.type === 'ideas') return (
              <div key={i} className="grid gap-2 sm:gap-3">
                {block.items.map((idea) => (
                  <div key={idea.num} className="flex gap-3 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-amber-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">{idea.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm">{idea.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{idea.desc}</div>
                      <div className="flex gap-3 mt-1.5">
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Cost: {idea.cost}</span>
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">Sell: {idea.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
            if (block.type === 'tip') return (
              <div key={i} className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 mb-1">💡 Pro Tip</div>
                <p className="text-blue-900 text-sm">{block.text}</p>
              </div>
            );
            if (block.type === 'vocab') return (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                <span className="text-xs font-bold text-white bg-gray-800 px-2 py-0.5 rounded mt-0.5 shrink-0">{block.term}</span>
                <span className="text-sm text-gray-600">{block.definition}</span>
              </div>
            );
            return null;
          })}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
          <Link href="/learn" className="text-sm text-gray-500 hover:text-gray-700">← Back to all articles</Link>
          <Link href="/editor" className="bg-amber-400 hover:bg-amber-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Go to My Store →
          </Link>
        </div>
      </main>
    </div>
  );
}
