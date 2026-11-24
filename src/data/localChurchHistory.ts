// Sources checked on 24 November 2026. Diocesan dates are not parish founding dates.
export const localHistorySources = {
  aglow: {
    label: "Deji Okegbile — recollection of AGLOW 2015 at 79 Atamunu Street",
    url: "https://dejiokegbile.com/archbishop-ekpenyong-10-years-after-legacy-of-true-worship-and-leadership/",
  },
  diocese: {
    label:
      "LEADERSHIP — creation of Atamunu Diocese and the May 2023 inauguration programme",
    url: "https://leadership.ng/methodist-church-to-install-otuekong-as-pioneer-bishop-of-atamunu-diocese/",
  },
  inauguration: {
    label: "LEADERSHIP — report from the inauguration and enthronement",
    url: "https://leadership.ng/fight-all-societal-vices-methodist-prelate-tells-new-bishop/",
  },
  reorganisation: {
    label: "CrossRiverWatch — Calabar diocesan reorganisation, 15 August 2026",
    url: "https://crossriverwatch.com/2026/08/reverend-otuekong-ukut-elevated-to-archbishop-of-all-methodist-dioceses-in-cross-river/",
  },
};

export const localChurchMilestones = [
  {
    date: "2015",
    title: "AGLOW at 79 Atamunu",
    description:
      "Deji Okegbile's later tribute recalls Archbishop Efiom E. Ekpenyong ministering at AGLOW 2015 at this church, on the theme ‘Restoring the wasted years’.",
    source: "aglow",
  },
  {
    date: "August 2022",
    title: "Atamunu Diocese is created",
    description:
      "The Methodist Conference created Atamunu Diocese from Calabar Diocese and selected Rt. Rev. Otuekong Ukut as its pioneer bishop.",
    source: "diocese",
  },
  {
    date: "7 May 2023",
    title: "Inauguration at the Cathedral of Favour",
    description:
      "The inauguration of the diocese, the pioneer bishop's enthronement, and the presentation of Lay President Elder Dr. Gabriel Inyang formed the Trinity Service.",
    source: "inauguration",
  },
  {
    date: "August 2026",
    title: "A further diocesan chapter",
    description:
      "Reporting on the Calabar church reorganisation identified the former Atamunu Diocese as the Diocese of Calabar Central.",
    source: "reorganisation",
  },
] as const;
