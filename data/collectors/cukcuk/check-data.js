require('dotenv').config();
const { ApiClient } = require('./utils/api-client');
const client = new ApiClient();

async function checkData() {
  try {
    console.log('Fetching menu items from CukCuk API...');
    const menuItems = await client.getCukCukMenuItems(false);
    console.log('Total menu items from CukCuk API:', menuItems.length);

    // Check how many have valid branch data
    const withValidBranch = menuItems.filter(item => item.BranchId && item.BranchId !== '00000000-0000-0000-0000-000000000000');
    console.log('Menu items with valid branch ID:', withValidBranch.length);

    // Check current Directus count
    const directusItems = await client.getDirectusItems('menu_items', {}, 1);
    console.log('Current menu items in Directus:', directusItems.data?.length || 0);

    // Check some sample items
    console.log('\nSample menu items:');
    menuItems.slice(0, 5).forEach(item => {
      console.log(`- ${item.Name} (Branch: ${item.BranchName || 'None'})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkData();