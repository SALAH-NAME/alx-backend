#!/usr/bin/env python3
""" 1-fifo_cache.py """

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFOCache Class
    """

    def __init__(self):
        """ __init__
        """
        super().__init__()
        self.order = []

    def put(self, key, item):
        """ put function
        """
        if key is not None and item is not None:
            if key not in self.cache_data:
                self.order.append(key)
            self.cache_data[key] = item
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                first_key = self.order.pop(0)
                del self.cache_data[first_key]
                print(f"DISCARD: {first_key}")

    def get(self, key):
        """ get function
        """
        return self.cache_data.get(key, None)
