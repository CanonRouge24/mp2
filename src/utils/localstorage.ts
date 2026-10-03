interface CacheItem<T>
{
  data : T;

  // Unix timestamp
  expiry : number;
}

/**
 * @param lifetime Lifetime in seconds of data before refresh
 */
function setCachedData<T> (key : string, data : T, lifetime : number) : void
{
  const item : CacheItem<T> = {
    data,
    expiry: Date.now() + lifetime * 1000
  };

  try
  {
    localStorage.setItem(key, JSON.stringify(item));
  }
  catch (error)
  {
    console.error("Failed to write to localStorage", error);
  }
}

/**
 * Retrieves data from localStorage if not expired, or null otherwise
 */
function getCachedData<T> (key : string) : T | null
{
  const json = localStorage.getItem(key);

  // Data not even stored
  if (json === null)
  {
    return json;
  }

  try
  {
    const item : CacheItem<T> = JSON.parse(json);

    // Item expired, remove
    if (Date.now() >= item.expiry)
    {
      localStorage.removeItem(key);

      return null;
    }

    // Else
    return item.data;
  }
  catch (error)
  {
    // Corrupt data, remove item
    localStorage.removeItem(key);

    return null;
  }
}

export { setCachedData, getCachedData };
