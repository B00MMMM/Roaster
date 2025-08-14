require('dotenv').config();
const mongoose = require('mongoose');
const Trait = require('./models/Trait');

const traitsData = [
  // ================== Personality (20+) ==================
  { category: "Personality", name: "Introvert" },
  { category: "Personality", name: "Extrovert" },
  { category: "Personality", name: "Overthinker" },
  { category: "Personality", name: "Jealous" },
  { category: "Personality", name: "Talkative" },
  { category: "Personality", name: "Always Positive" },
  { category: "Personality", name: "Always Negative" },
  { category: "Personality", name: "Overdramatic" },
  { category: "Personality", name: "Lazy" },
  { category: "Personality", name: "Hyperactive" },
  { category: "Personality", name: "Sarcastic" },
  { category: "Personality", name: "Bossy" },
  { category: "Personality", name: "Forgetful" },
  { category: "Personality", name: "Clumsy" },
  { category: "Personality", name: "Moody" },
  { category: "Personality", name: "Perfectionist" },
  { category: "Personality", name: "Daydreamer" },
  { category: "Personality", name: "Know-it-all" },
  { category: "Personality", name: "Impulsive" },
  { category: "Personality", name: "Stubborn" },
  { category: "Personality", name: "Too Honest" },

  // ================== Funny / Embarrassing Habits (20+) ==================
  { category: "Funny/Embarrassing", name: "Sleeps without clothes" },
  { category: "Funny/Embarrassing", name: "Still watches kids shows" },
  { category: "Funny/Embarrassing", name: "Laughs at own jokes" },
  { category: "Funny/Embarrassing", name: "Trips over nothing" },
  { category: "Funny/Embarrassing", name: "Snores loudly" },
  { category: "Funny/Embarrassing", name: "Obsessed with memes" },
  { category: "Funny/Embarrassing", name: "Sings in the shower" },
  { category: "Funny/Embarrassing", name: "Eats loudly" },
  { category: "Funny/Embarrassing", name: "Talks to themselves" },
  { category: "Funny/Embarrassing", name: "Falls asleep anywhere" },
  { category: "Funny/Embarrassing", name: "Uses baby voice" },
  { category: "Funny/Embarrassing", name: "Still afraid of the dark" },
  { category: "Funny/Embarrassing", name: "Wears socks to bed" },
  { category: "Funny/Embarrassing", name: "Collects weird items" },
  { category: "Funny/Embarrassing", name: "Cries during cartoons" },
  { category: "Funny/Embarrassing", name: "Eats in bed" },
  { category: "Funny/Embarrassing", name: "Dances alone in room" },
  { category: "Funny/Embarrassing", name: "Talks in sleep" },
  { category: "Funny/Embarrassing", name: "Giggles randomly" },
  { category: "Funny/Embarrassing", name: "Overreacts to small things" },
  { category: "Funny/Embarrassing", name: "Makes weird sound effects" },

  // ================== Body Structure (20+) ==================
  { category: "Body Structure", name: "Big Forehead" },
  { category: "Body Structure", name: "Bald" },
  { category: "Body Structure", name: "Fat" },
  { category: "Body Structure", name: "Too Skinny" },
  { category: "Body Structure", name: "Short" },
  { category: "Body Structure", name: "Tall & Awkward" },
  { category: "Body Structure", name: "Big Nose" },
  { category: "Body Structure", name: "Double Chin" },
  { category: "Body Structure", name: "Unibrow" },
  { category: "Body Structure", name: "Bug Eyes" },
  { category: "Body Structure", name: "Crooked Teeth" },
  { category: "Body Structure", name: "Potbelly" },
  { category: "Body Structure", name: "Short Arms" },
  { category: "Body Structure", name: "Bow Legs" },
  { category: "Body Structure", name: "Knock Knees" },
  { category: "Body Structure", name: "Big Ears" },
  { category: "Body Structure", name: "Long Neck" },
  { category: "Body Structure", name: "Patchy Beard" },
  { category: "Body Structure", name: "Puffy Cheeks" },
  { category: "Body Structure", name: "Crooked Nose" },
  { category: "Body Structure", name: "No Eyebrows" },
];

const seedTraits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing traits and insert new ones
    await Trait.deleteMany({});
    console.log('Cleared existing traits');
    
    // Insert all traits
    const inserted = await Trait.insertMany(traitsData);
    console.log(`✅ Successfully seeded ${inserted.length} traits:`);
    
    // Group by category for display
    const grouped = inserted.reduce((acc, trait) => {
      if (!acc[trait.category]) acc[trait.category] = [];
      acc[trait.category].push(trait.name);
      return acc;
    }, {});
    
    Object.entries(grouped).forEach(([category, traits]) => {
      console.log(`  ${category}: ${traits.join(', ')}`);
    });
    
  } catch (error) {
    console.error('Error seeding traits:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedTraits();
