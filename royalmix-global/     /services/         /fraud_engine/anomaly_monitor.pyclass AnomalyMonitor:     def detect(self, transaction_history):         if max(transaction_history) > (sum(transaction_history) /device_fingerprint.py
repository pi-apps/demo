import hashlib

class DeviceFingerprint:
    def generate(self, device_info):
        raw = f"{device_info['ip']}-{device_info['browser']}-{device_info['os']}"
        return hashlib.sha256(raw.encode()).hexdigest()

    def compare(self, stored_fingerprint, new_fingerprint):
        return stored_fingerprint == new_fingerprint
