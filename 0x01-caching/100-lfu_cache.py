#!/usr/bin/env python3
""" 100-lfu_cache.py """

from base_caching import BaseCaching
from collections import defaultdict


class LFUCache(BaseCaching):
    """ LFUCache Class
    """

    def __init__(self):
        """ __init__
        """
        super().__init__()
        self.frequency = defaultdict(int)
        self.usage_order = []

    def put(self, key, item):
        """ put function
        """
        if key is not None and item is not None:
            if key in self.cache_data:
                self.usage_order.remove(key)
            self.cache_data[key] = item
            self.frequency[key] += 1
            self.usage_order.append(key)
            if len(self.cache_data) > BaseCaching.MAX_ITEMS:
                self.evict()

    def get(self, key):
        """ get function
        """
        if key in self.cache_data:
            self.frequency[key] += 1
            self.usage_order.remove(key)
            self.usage_order.append(key)
            return self.cache_data[key]
        return None

    def evict(self):
        """ evict function
        """
        min_freq = min(self.frequency.values())
        lfu_keys = [k for k, v in self.frequency.items() if v == min_freq]
        if len(lfu_keys) > 1:
            lru_key = None
            for key in self.usage_order:
                if key in lfu_keys:
                    lru_key = key
                    break
            self.usage_order.remove(lru_key)
            del self.cache_data[lru_key]
            del self.frequency[lru_key]
            print(f"DISCARD: {lru_key}")
        else:
            lfu_key = lfu_keys[0]
            self.usage_order.remove(lfu_key)
            del self.cache_data[lfu_key]
            del self.frequency[lfu_key]
            print(f"DISCARD: {lfu_key}")
