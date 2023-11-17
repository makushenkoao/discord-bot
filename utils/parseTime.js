function parseTime(timeString) {
    const regex = /(\d+)(h|m)/g;
    let match;
    let totalMilliseconds = 0;

    while ((match = regex.exec(timeString)) !== null) {
        const value = parseInt(match[1]);
        const unit = match[2];

        switch (unit) {
            case 'h':
                totalMilliseconds += value * 60 * 60 * 1000;
                break;
            case 'm':
                totalMilliseconds += value * 60 * 1000;
                break;
        }
    }

    return totalMilliseconds || NaN;
}

module.exports = parseTime;
