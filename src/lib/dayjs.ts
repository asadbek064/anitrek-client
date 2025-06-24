import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import "dayjs/locale/es";
import "dayjs/locale/de";


dayjs.extend(updateLocale);
dayjs.extend(relativeTime);

export default dayjs;
