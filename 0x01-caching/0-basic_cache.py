#!/usr/bin/python3
""" 0-basic_cache.py """

from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """ BasicCache Class
    """

    def put(self, key, item):
        """ put function
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """ get function
        """
        return self.cache_data.get(key, None)
