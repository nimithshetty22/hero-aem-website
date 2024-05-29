export function createHeaderDOM () {
    let endpoint = 'https://main--hero-aem-website--nimithshetty22.hlx.live/query-index.json'
    const DOM = getData(endpoint).then(response =>{console.log(response.data)})
}

const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response;
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };