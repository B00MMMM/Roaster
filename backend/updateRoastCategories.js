quire('dotenv').config();
const mongoose = require('mongoose');
const Roast = require('./models/Roast');

// Category mapping based on tags and content
const categoryMappings = [
  // Savage category keywords
  { keywords: ['trophy', 'participation', 'unwanted', 'airplane', 'wifi', 'disappointing', 'conspiracy', 'confusing', 'nonsense', 'popup', 'annoying'], category: 'savage' },
  
  // Friendly category keywords  
  { keywords: ['monday', 'morning', 'tired', 'personality', 'bland', 'crackers', 'trial', 'temporary', 'dad', 'joke', 'snooze', 'fortune', 'sweet', 'autocorrect', 'bookmark'], category: 'friendly' },
  
  // Professional category keywords
  { keywords: ['gps', 'lost', 'directions', 'conference', 'call', 'meeting', 'office', 'coffee', 'team', 'building', 'report', 'retreat', 'performance', 'review', 'wifi', 'training', 'picnic'], category: 'professional' },
  
  // Tech category keywords
  { keywords: ['internet', 'explorer', '404', 'error', 'buffering', 'video', 'captcha', 'password', 'bug', 'software', 'spam', 'email', 'battery', 'windows', 'update', 'airplane', 'mode'], category: 'tech' },
  
  // Food category keywords
  { keywords: ['decaf', 'coffee', 'diet', 'soda', 'gas', 'sandwich', 'banana', 'noodles', 'bread', 'ketchup', 'vending', 'pizza'], category: 'food' },
  
  // Animal category keywords
  { keywords: ['sloth', 'mosquito', 'cat', 'penguin', 'goldfish', 'peacock', 'hamster', 'chicken', 'llama', 'turtle'], category: 'animal' },
  
  // Weather category keywords
  { keywords: ['cloudy', 'tornado', 'drizzle', 'humidity', 'forecast', 'fog', 'heat', 'snowflake', 'thunderstorm', 'wind'], category: 'weather' },
  
  // Transport category keywords
  { keywords: ['cart', 'bicycle', 'public', 'taxi', 'speed', 'bump', 'parking', 'tire', 'traffic', 'toll'], category: 'transport' },
  
  // Gaming category keywords
  { keywords: ['loading', 'tutorial', 'quest', 'lag', 'crash', 'microtransaction', 'npc', 'glitch', 'pay', 'checkpoint'], category: 'gaming' }
];

async function updateRoastCategories() {
  try {
    console.log('🔄 Starting category update process...');
    
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Get all roasts
    const roasts = await Roast.find({});
    console.log(`📊 Found ${roasts.length} roasts to update`);

    let updatedCount = 0;

    for (let roast of roasts) {
      let assignedCategory = 'random'; // default category
      
      // Check tags for category assignment
      for (let mapping of categoryMappings) {
        const hasMatchingTag = roast.tags.some(tag => 
          mapping.keywords.includes(tag.toLowerCase())
        );
        
        if (hasMatchingTag) {
          assignedCategory = mapping.category;
          break;
        }
      }
      
      // If no tag match, check text content
      if (assignedCategory === 'random') {
        const roastText = roast.text.toLowerCase();
        
        for (let mapping of categoryMappings) {
          const hasMatchingKeyword = mapping.keywords.some(keyword => 
            roastText.includes(keyword)
          );
          
          if (hasMatchingKeyword) {
            assignedCategory = mapping.category;
            break;
          }
        }
      }
      
      // Update the roast with category
      await Roast.findByIdAndUpdate(roast._id, { category: assignedCategory });
      updatedCount++;
      
      console.log(`📝 Updated roast ${updatedCount}: "${roast.text.substring(0, 50)}..." -> ${assignedCategory}`);
    }

    console.log(`🎉 Successfully updated ${updatedCount} roasts with categories!`);
    
    // Show category distribution
    const categoryStats = await Roast.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📊 Category Distribution:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} roasts`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Update error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  updateRoastCategories();
}

module.exports = updateRoastCategories;
