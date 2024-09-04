#!/usr/bin/env python3
""" 4-mru_cache.py """

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """ MRUCache Class
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
                mru_key = self.order.pop(-2)
                del self.cache_data[mru_key]
                print(f"DISCARD: {mru_key}")

    def get(self, key):
        """ get function
        """
        if key in self.cache_data:
            self.order.remove(key)
            self.order.append(key)
            return self.cache_data[key]
        return None
