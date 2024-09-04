#!/usr/bin/env python3
""" 2-lifo_cache.py """

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """ LIFOCache Class
    """

    def __init__(self):
        """ __init__
        """
        super().__init__()
        self.last_key = None

    def put(self, key, item):
        """ put function
        """
        if key is not None and item is not None:
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                if self.last_key:
                    del self.cache_data[self.last_key]
                    print(f"DISCARD: {self.last_key}")
            self.last_key = key

    def get(self, key):
        """ get function
        """
        return self.cache_data.get(key, None)
