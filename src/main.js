const data = [{
    "from": "2023-05-30T05:56:28+00:00",
    "to": "2023-05-30T05:57:10+00:00",
}, {
    "from": "2023-05-30T06:01:01+00:00",
    "to": "2023-05-30T06:49:31+00:00",
}, {
    "from": "2023-05-30T07:04:21+00:00",
    "to": "2023-05-30T07:05:26+00:00",
}, {
    "from": "2023-05-30T08:27:42+00:00",
    "to": "2023-05-30T08:28:52+00:00",
}, {
    "from": "2023-05-30T08:29:43+00:00",
    "to": "2023-05-30T08:31:28+00:00",
}, {
    "from": "2023-05-30T10:19:15+00:00",
    "to": "2023-05-30T10:21:02+00:00",
}, {
    "from": "2023-05-30T16:50:26+00:00",
    "to": "2023-05-30T16:50:49+00:00",
}, {
    "from": "2023-05-30T17:03:12+00:00",
    "to": "2023-05-30T17:04:24+00:00",
}, {
    "from": "2023-05-30T17:05:11+00:00",
    "to": "2023-05-30T17:05:55+00:00",
}, {
    "from": "2023-05-30T19:29:46+00:00",
    "to": "2023-05-30T19:31:04+00:00",
}, {
    "from": "2023-05-30T20:42:28+00:00",
    "to": "2023-05-30T20:43:31+00:00",
}]

const togetherData = () => {
    let index = 0;
    let newArray = [];
    while (index < data.length) {
        let group = {
            from: new Date(data[index].from),
            to: new Date(data[index].to),
            elements:  1,
        };
        while (index + 1 < data.length && (new Date(data[index + 1].from).getTime() - new Date(data[index].to).getTime()) < (15 * 60 * 1000)) {
            group.to =  new Date(data[index + 1].to);
            group.elements++
            index++
        }
        newArray = [...newArray, group];
        index++;
    }
    return newArray;
}

const togetherDataConst = togetherData()

const createGaps = () => {
    const dateHour = togetherDataConst[0].from.getUTCHours();
    const dateMinutes = togetherDataConst[0].from.getUTCMinutes();
    const dateSeconds = togetherDataConst[0].from.getUTCSeconds();
    const date = togetherDataConst[0].from.getTime() - ((dateSeconds * 1000) + (1000 * 60 * dateMinutes) + (1000 * 60 * 60 * dateHour))
    const finishDate = date + (23 * 60 * 60 + 59 * 60 + 59) * 1000;
    let cursor = date;
    let result = [];
    for (let togetherDataConstElement of togetherDataConst) {
        const from = togetherDataConstElement.from.getTime();
        const to = togetherDataConstElement.to.getTime();
        if (from > cursor) {
            result.push({ time: from - cursor, gap: "gap" })
        }
        result.push({ ...togetherDataConstElement, time: to - from });
        cursor = to;
    }
    if (finishDate > cursor) {
        result.push({ time: finishDate - cursor, gap: "gap" });
    }
    return result;
}
const items = createGaps();

const render = () => {
    const track = document.getElementById("track");
    track.innerHTML = "";

    for (const item of items) {
        const el = document.createElement("div");
        el.style.flexGrow = item.time;

        if (item.gap) {
            el.className = "gap";
        } else {
            el.className = "visit";
            for (let i = 0; i < item.elements; i++) {
                const dot = document.createElement("span");
                dot.className = "dot";
                el.append(dot);
            }
        }

        track.append(el);
    }

    const groups = items.filter((item) => !item.gap);
    const visits = groups.reduce((sum, item) => sum + item.elements, 0);

    document.getElementById("day-visits").textContent = `${visits} visits`;
    document.getElementById("day-date").textContent = groups[0].from
        .toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            timeZone: "UTC",
        })
        .replace(",", "");
};
render()