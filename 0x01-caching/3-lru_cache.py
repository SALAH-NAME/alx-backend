#!/usr/bin/env python3
""" 3-lru_cache.py """

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """ LRUCache Class
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
            if key in self.cache_data:
                self.order.remove(key)
            self.cache_data[key] = item
            self.order.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                lru_key = self.order.pop(0)
                del self.cache_data[lru_key]
                print(f"DISCARD: {lru_key}")

    def get(self, key):
        """ get function
        """
        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data[key]
        return None
