function getDeviceFingerprint() {
    return navigator.userAgent + navigator.platform + screen.width + screen.height;
}

export default getDeviceFingerprint;
