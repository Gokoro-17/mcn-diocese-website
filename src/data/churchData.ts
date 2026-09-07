import childrensMinistryLogo from "../assets/ministries/childrens-ministry.png";
import youthFellowshipLogo from "../assets/ministries/youth-fellowship-new.jpeg";
import womensFellowshipLogo from "../assets/ministries/womens-fellowship.jpeg";
import mensFellowshipLogo from "../assets/ministries/mens-fellowship.jpeg";
import ladiesGirlsFellowshipLogo from "../assets/ministries/ladies-girls-fellowship.jpeg";
import youngMensFellowshipLogo from "../assets/ministries/young-mens-fellowship.jpeg";
import mediaUnitLogo from "../assets/ministries/media-unit.jpeg";
import sisMercyBasseyPhoto from "../assets/leaders/sis-mercy-bassey.png";

export const CHURCH_NAME = "The Methodist Cathedral of Favour";
export const DENOMINATION_NAME = "Methodist Church Nigeria";
export const TAGLINE = "Worthy is the Lamb";
export const MOTTO = "Spreading Scriptural Holiness Over the Land";

export const contactInfo = {
  email: "atamunudiocese@gmail.com",
  phone: "+234 803 000 0000",
  phone2: "+234 806 000 0000",
  address: "No.79 Atamunu Street, Cross River State, Calabar, Nigeria.",
  facebook: "https://www.facebook.com/share/1ErgCwd1gS/?mibextid=wwXIfr",
  whatsapp: "https://wa.me/2348030000000",
  whatsappGroup: "https://chat.whatsapp.com/I0820fmOBDk4dJPRXK5Rnw?s=cl&p=a&mlu=4&ilr=4",
  maps: "https://maps.app.goo.gl/VDDSEQuhZr5NQfk87",
  mapEmbed: "https://www.google.com/maps/embed?pb=!4v1788646758283!6m8!1m7!1sRQXJ1nLU861RJXFJ2tDUDw!2m2!1d4.93823245365552!2d8.334695911447126!3f35.75587129819078!4f-2.2861430643759633!5f0.7820865974627469",
};

export const serviceTimes = [
  { day: "Sunday", time: "7:00 AM", name: "1st Service" },
  { day: "Sunday", time: "9:00 AM", name: "Sunday School" },
  { day: "Sunday", time: "10:00 AM", name: "2nd Service" },
];

export const weeklyActivities = [
  {
    day: "Sunday",
    activities: [
      { time: "7:00 AM", name: "1st Service" },
      { time: "9:00 AM", name: "Sunday School" },
      { time: "10:00 AM", name: "2nd Service" },
      { time: "3:00 PM", name: "YF Moment of Refreshing", note: "Except 1st Sundays" },
      { time: "7:00 AM", name: "Eucharistic & Empowerment Service", note: "Every 1st Sunday" },
    ],
  },
  {
    day: "Monday",
    activities: [
      { time: "6:00 to 7:00 AM", name: "Workers and Business People Divine Encounter" },
    ],
  },
  {
    day: "Tuesday",
    activities: [
      { time: "6:00 AM", name: "Prayer & Fasting for All" },
      { time: "10:00 AM", name: "Prison Ministry" },
    ],
  },
  {
    day: "Wednesday",
    activities: [
      { time: "5:00 PM", name: "Preservation Service" },
    ],
  },
  {
    day: "Friday",
    activities: [
      { time: "5:00 PM", name: "Bible Study" },
    ],
  },
  {
    day: "Saturday",
    activities: [
      { time: "Morning", name: "Church Cleanup" },
      { time: "5:00 PM", name: "Choir Rehearsals" },
    ],
  },
];

export const heroSlides = [
  {
    id: 1,
    title: "Welcome to the Cathedral of Favour",
    subtitle: "A Place of Worship, Fellowship & Spiritual Growth",
    cta: "Join Us This Sunday",
    bg: "from-navy-900 via-red-900 to-navy-800",
  },
  {
    id: 2,
    title: "Worthy is the Lamb",
    subtitle: "Rooted in Faith, Growing in Grace, Serving with Love",
    cta: "Learn More About Us",
    bg: "from-red-900 via-navy-900 to-green-900",
  },
  {
    id: 3,
    title: "Come & Experience God",
    subtitle: "Every Sunday is a New Opportunity to Encounter the Living God",
    cta: "Our Service Times",
    bg: "from-navy-800 via-red-900 to-navy-900",
  },
];

export const sermons = [
  {
    id: 1,
    title: "Walking in the Fullness of God",
    preacher: "Rt. Rev. Emmanuel Chukwudi",
    date: "May 25, 2025",
    duration: "52:14",
    description: "A powerful message on living in the overflow of God's grace and understanding our identity as children of the Most High.",
    category: "Sunday Service",
    thumbnail: null,
    videoUrl: "",
    audioUrl: "",
  },
  {
    id: 2,
    title: "The Power of Prayer and Fasting",
    preacher: "Very Rev. Grace Okonkwo",
    date: "May 18, 2025",
    duration: "48:32",
    description: "Discovering the transformative power of combined prayer and fasting in the life of a believer and the church community.",
    category: "Sunday Service",
    thumbnail: null,
    videoUrl: "",
    audioUrl: "",
  },
  {
    id: 3,
    title: "Foundations of Methodist Faith",
    preacher: "Rt. Rev. Emmanuel Chukwudi",
    date: "May 11, 2025",
    duration: "55:07",
    description: "An inspiring journey through the core doctrines and traditions that make Methodism a beacon of Christianity centred on grace.",
    category: "Doctrine Series",
    thumbnail: null,
    videoUrl: "",
    audioUrl: "",
  },
  {
    id: 4,
    title: "The Grace That Saves",
    preacher: "Rev. Samuel Adeyemi",
    date: "May 4, 2025",
    duration: "44:18",
    description: "Understanding God's amazing grace. It is not just a theological concept, but a living, breathing reality in our daily walk.",
    category: "Sunday Service",
    thumbnail: null,
    videoUrl: "",
    audioUrl: "",
  },
  {
    id: 5,
    title: "Building God's Kingdom Together",
    preacher: "Very Rev. Grace Okonkwo",
    date: "April 27, 2025",
    duration: "50:44",
    description: "A call to unity and collaboration as the body of Christ, working together to extend God's Kingdom in our community and beyond.",
    category: "Special Service",
    thumbnail: null,
    videoUrl: "",
    audioUrl: "",
  },
];

export const events = [
  {
    id: 1,
    name: "Women's Week 2025",
    startDate: "June 2",
    endDate: "June 8",
    month: "June",
    year: "2025",
    description: "A week of prayer, Bible study, fellowship, and celebration for women of all ages in the diocese.",
    color: "#C8102E",
  },
  {
    id: 2,
    name: "Men's Week & Retreat",
    startDate: "June 16",
    endDate: "June 22",
    month: "June",
    year: "2025",
    description: "Men gather for a powerful week of spiritual renewal, leadership workshops, and activities that build faith.",
    color: "#1B2A6B",
  },
  {
    id: 3,
    name: "Children's Day Celebration",
    startDate: "May 27",
    endDate: "May 27",
    month: "May",
    year: "2025",
    description: "A special day dedicated to celebrating and ministering to the children of our diocese with fun, worship, and the Word.",
    color: "#2D6A2D",
  },
  {
    id: 4,
    name: "Annual Diocesan Synod",
    startDate: "July 7",
    endDate: "July 11",
    month: "July",
    year: "2025",
    description: "A special gathering where church leaders and ministry teams convene for worship, vision, and service.",
    color: "#B8960C",
  },
  {
    id: 5,
    name: "Youth Fellowship Convention",
    startDate: "August 1",
    endDate: "August 4",
    month: "August",
    year: "2025",
    description: "Young people from across the diocese come together for worship, seminars, outreach, and spiritual empowerment.",
    color: "#C8102E",
  },
  {
    id: 6,
    name: "Harvest Thanksgiving",
    startDate: "November 2",
    endDate: "November 2",
    month: "November",
    year: "2025",
    description: "Annual thanksgiving service celebrating God's faithfulness and provision over the church and its members.",
    color: "#B8960C",
  },
];

export interface MinistryPresident {
  name: string;
  title?: string;
  photo?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
}

export interface Ministry {
  id: number;
  slug: string;
  name: string;
  ageGroup: string;
  tagline: string;
  description: string;
  images: Array<string | null>;
  color: string;
  logo: string | null;
  subGroups?: string[];
  president?: MinistryPresident;
}

export const ministries: Ministry[] = [
  {
    id: 1,
    slug: "childrens-ministry",
    name: "Children's Ministry",
    ageGroup: "Ages 0 to 15",
    tagline: "Living for Christ & Shining as Stars",
    description: "Our Children's Ministry is a safe, nurturing, and vibrant space where children are taught the Word of God through lessons suited to their age, games, and activities. We are committed to building a solid spiritual foundation in every child, helping them grow in faith, character, and purpose.",
    images: [null, null, null],
    color: "#2D6A2D",
    logo: childrensMinistryLogo,
    president: {
      name: "Sis. Mercy Bassey",
      title: "Superintendent",
      photo: sisMercyBasseyPhoto,
    },
  },
  {
    id: 2,
    slug: "youth-fellowship",
    name: "Youth Fellowship (MYF)",
    ageGroup: "Ages 16 to 35",
    tagline: "Fire. Faith. Future.",
    description: "Methodist Youth Fellowship is the heartbeat of the next generation. Our youth are passionate, driven by purpose, and deeply rooted in Scripture. Through Bible studies, outreach programs, retreats, and fellowship nights, we are raising bold Christian leaders who will transform society.",
    images: [null, null, null],
    color: "#17176B",
    logo: youthFellowshipLogo,
  },
  {
    id: 3,
    slug: "womens-fellowship",
    name: "Women's Fellowship",
    ageGroup: "Women",
    tagline: "Faith. Fellowship. Service.",
    description: "The Methodist Women's Fellowship brings women together for prayer, discipleship, compassionate service, and Christian fellowship. Members use their gifts to strengthen families, serve the church, and bless the wider community.",
    images: [null, null, null],
    color: "#8A7B16",
    logo: womensFellowshipLogo,
  },
  {
    id: 4,
    slug: "mens-fellowship",
    name: "Men's Fellowship",
    ageGroup: "Men",
    tagline: "As for Me and My Family, We'll Serve the Lord.",
    description: "The Methodist Men's Fellowship equips men for faithful Christian leadership at home, in the church, and in society through prayer, fellowship, mentoring, and service.",
    images: [null, null, null],
    color: "#12399E",
    logo: mensFellowshipLogo,
  },
  {
    id: 5,
    slug: "ladies-and-girls-fellowship",
    name: "Ladies' and Girls' Fellowship",
    ageGroup: "Ladies and Girls",
    tagline: "Godliness and Contentment.",
    description: "The Ladies' and Girls' Fellowship nurtures girls and young women in godliness, confidence, fellowship, and service, helping them grow into faithful disciples of Christ.",
    images: [null, null, null],
    color: "#1732A2",
    logo: ladiesGirlsFellowshipLogo,
  },
  {
    id: 6,
    slug: "young-mens-fellowship",
    name: "Young Men's Fellowship",
    ageGroup: "Young Men",
    tagline: "Running with the Vision.",
    description: "The Young Men's Fellowship develops young men through Christian discipleship, brotherhood, leadership training, and active service in the church and community.",
    images: [null, null, null],
    color: "#D41423",
    logo: youngMensFellowshipLogo,
  },
  {
    id: 7,
    slug: "worship-ministry",
    name: "Worship Ministry",
    ageGroup: "All Ages",
    tagline: "Excellence in God's Presence",
    description: "Our Worship Ministry comprises gifted and anointed choristers, band members, drummers, organists, trumpeters, and vocalists who lead the congregation into a deeper encounter with God. Every instrument, every voice, and every song is offered as a sacrifice of praise to the Almighty.",
    images: [null, null, null],
    color: "#B8960C",
    logo: null,
    subGroups: ["Choristers", "Band", "Drummer", "Organist", "Trumpeters", "Singers"],
  },
  {
    id: 8,
    slug: "media-unit",
    name: "Media Unit",
    ageGroup: "All Ages",
    tagline: "Broadcasting the Good News",
    description: "The Media Unit amplifies the voice of the Methodist Cathedral of Favour beyond our walls. Through audio and video production, live streaming, social media, and digital content creation, we ensure that the message of the Gospel reaches every corner, both online and offline.",
    images: [null, null, null],
    color: "#A7191F",
    logo: mediaUnitLogo,
  },
];

export const bibleVerses = [
  { verse: "For God so loved the world that He gave His one and only Son, that whoever believes in Him shall not perish but have eternal life.", reference: "John 3:16", version: "NIV" },
  { verse: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:5-6", version: "NIV" },
  { verse: "I can do all this through him who gives me strength.", reference: "Philippians 4:13", version: "NIV" },
  { verse: "The LORD is my shepherd, I lack nothing.", reference: "Psalm 23:1", version: "NIV" },
  { verse: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11", version: "NIV" },
  { verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", reference: "Joshua 1:9", version: "NIV" },
  { verse: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", reference: "Isaiah 40:31", version: "NIV" },
];

export const leaders = [
  {
    id: 1,
    name: "The Rt. Rev. Barr. Otuekong Ukut, PhD",
    position: "Bishop",
    rank: 1,
    description: "His Lordship, the Right Reverend Barr. Otuekong Ukut, PhD, leads with wisdom, integrity, and an unwavering commitment to the growth of God's Kingdom.",
    image: null,
  },
  {
    id: 2,
    name: "The Very Rev. Ime A. Udo (JP)",
    position: "Circuit Presbyter",
    rank: 2,
    description: "The Very Reverend Ime A. Udo (JP) serves with exceptional pastoral care and administrative excellence, overseeing the circuits of the diocese with grace and dedication.",
    image: null,
  },
  {
    id: 3,
    name: "The Very Rev. Prof. Asindi A. Asindi (S)",
    position: "Cathedral Minister",
    rank: 3,
    description: "The Very Reverend Prof. Asindi A. Asindi (S) is a gifted preacher, teacher, and administrator who faithfully oversees the ministry operations and pastoral activities across multiple circuits.",
    image: null,
  },
  {
    id: 4,
    name: "The Rev. Clement Etukudo",
    position: "Cathedral Minister",
    rank: 4,
    description: "Rev. Mrs. Comfort I. Nduka has transformed the Women's Fellowship through powerful discipleship programs, community outreach, and faithful spiritual leadership.",
    image: null,
  },
  {
    id: 5,
    name: "Rev. David E. Okoro",
    position: "Youth & Campus Coordinator",
    rank: 5,
    description: "Rev. David E. Okoro is the driving force behind youth ministry across the diocese, mentoring the next generation with passion, vision, and purpose centred on Christ.",
    image: null,
  },
  {
    id: 6,
    name: "Deacon Mrs. Patience A. Eze",
    position: "Diocesan Missions Director",
    rank: 6,
    description: "Deacon Mrs. Patience A. Eze coordinates all missionary and evangelism activities, ensuring the Great Commission remains central to everything the diocese does.",
    image: null,
  },
];

export const bankAccounts = [
  {
    id: 1,
    bankName: "Zenith Bank",
    accountName: "MCN Building Fund",
    accountNumber: "1310197576",
    purpose: "Building Fund",
    color: "#C8102E",
    verified: true,
  },
  {
    id: 2,
    bankName: "United Bank for Africa (UBA)",
    accountName: "MCN, 79 Atamunu St.",
    accountNumber: "1024606865",
    purpose: "Tithes",
    color: "#1B2A6B",
    verified: true,
  },
];

export const galleryCategories = [
  "All", "Worship Services", "Events", "Choir", "Youth", "Community Outreach"
];

export const galleryItems = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  category: ["Worship Services", "Events", "Choir", "Youth", "Community Outreach"][i % 5],
  title: [
    "Sunday Worship Service",
    "Annual Harvest Thanksgiving",
    "Choir Ministration",
    "Youth Convention 2024",
    "Community Outreach Program",
    "Bishop's Easter Service",
    "Women's Week Opening",
    "Men's Fellowship Day",
    "Children's Department Drama",
    "Diocesan Synod 2024",
    "Christmas Carol Service",
    "New Year Service",
    "Marriage Enrichment Seminar",
    "Missions Sunday",
    "Choir Festival",
    "Youth Talent Show",
    "Community Health Outreach",
    "Ordination Service",
  ][i],
  image: null,
}));

export const methodistHistory = {
  founding: "1844",
  founderInNigeria: "Rev. Thomas Birch Freeman",
  globalFounger: "Rev. John Wesley",
  globalFounded: "1739",
  description: `The Methodist Church Nigeria traces its roots to the pioneering work of the Wesleyan Methodist Missionary Society, which sent the Rev. Thomas Birch Freeman to Nigeria in 1842. His arrival in Badagry marked the beginning of a rich spiritual heritage that has since expanded across every corner of Nigeria.

The Methodist Church Nigeria was formally constituted as an autonomous church in 1962, and has since grown into one of the largest Protestant denominations in West Africa, with millions of faithful members organized into dozens of dioceses.

The Methodist Cathedral of Favour serves its community through the full ministry of Word, Sacrament, and Fellowship, rooted in the Wesleyan tradition of scriptural holiness, social engagement, and evangelical fervour.

The Cathedral continues to be a beacon of light through worship, discipleship, compassionate service, and the proclamation of the Gospel. It declares that worthy is indeed the Lamb.`,
};
