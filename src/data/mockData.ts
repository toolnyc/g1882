// Mock data for Gallery 1882 static prototypes

export const mockExhibitions = [
  {
    id: '1',
    title: 'Shoreline Reflections',
    artist: 'Sarah Chen',
    startDate: '2024-03-15',
    endDate: '2024-05-20',
    description:
      'A contemplative exploration of light and water along the Indiana Dunes shoreline.',
    image:
      'https://fastly.picsum.photos/id/79/2000/3011.jpg?hmac=TQsXWj0kLBLRXbSAh2Pygog1-cOefqpjEoKyl0uD3tg',
    featured: true,
  },
  {
    id: '2',
    title: 'Industrial Echoes',
    artist: 'Marcus Rodriguez',
    startDate: '2024-06-01',
    endDate: '2024-08-15',
    description:
      'Mixed media works examining the relationship between industry and nature in the Great Lakes region.',
    image:
      'https://fastly.picsum.photos/id/88/1280/1707.jpg?hmac=NnkwPVDBTVxHkc4rALB_fyu-OHY2usdm7iRk5El7JC4',
    featured: false,
  },
  {
    id: '3',
    title: 'Dune Formations',
    artist: 'Elena Kowalski',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    description: 'Sculptural interpretations of the ever-changing dune landscapes.',
    image:
      'https://fastly.picsum.photos/id/121/1600/1067.jpg?hmac=QDrnlQAvC_54xDpx2afpzKMbjCZvnRljseYvkK8XPCQ',
    featured: false,
  },
]

export const mockArtists = [
  {
    id: '1',
    name: 'Sarah Chen',
    bio: 'Sarah Chen is a landscape photographer based in Chicago, known for her intimate studies of the Great Lakes region.',
    image:
      'https://fastly.picsum.photos/id/185/3995/2662.jpg?hmac=gXqQYKLwRcZNsxrWGW6YosAXEIU6-D7UbytF_ApGmDs',
    exhibitions: ['Shoreline Reflections'],
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    bio: 'Marcus Rodriguez creates large-scale installations that explore the intersection of urban and natural environments.',
    image:
      'https://fastly.picsum.photos/id/221/1440/879.jpg?hmac=-y8GQ4KS-tmCflYwphSLZmsTu-m0rL8U6CldcgLjJoA',
    exhibitions: ['Industrial Echoes'],
  },
  {
    id: '3',
    name: 'Elena Kowalski',
    bio: 'Elena Kowalski is a sculptor whose work examines the relationship between geological time and human experience.',
    image: '/api/placeholder/400/500',
    exhibitions: ['Dune Formations'],
  },
]

export const mockEvents = [
  {
    id: '1',
    title: 'Opening Reception: Shoreline Reflections',
    date: '2024-03-15',
    time: '6:00 PM - 8:00 PM',
    description: "Join us for the opening of Sarah Chen's new exhibition.",
    type: 'opening',
  },
  {
    id: '2',
    title: 'Artist Talk: Marcus Rodriguez',
    date: '2024-06-15',
    time: '2:00 PM - 3:00 PM',
    description: 'The artist discusses his process and inspiration for Industrial Echoes.',
    type: 'talk',
  },
  {
    id: '3',
    title: 'Gallery Hours',
    date: '2024-03-01',
    time: '10:00 AM - 6:00 PM',
    description: 'Regular gallery hours: Wednesday through Sunday, 10 AM to 6 PM.',
    type: 'info',
  },
]

export const mockPress = [
  {
    id: '1',
    title: 'Gallery 1882 Opens with Stunning Dune-Inspired Exhibition',
    publication: 'Chicago Tribune',
    date: '2024-03-20',
    url: '#',
  },
  {
    id: '2',
    title: 'New Art Space Celebrates Indiana Dunes Heritage',
    publication: 'Art in America',
    date: '2024-03-18',
    url: '#',
  },
  {
    id: '3',
    title: 'Gallery 1882: Where Art Meets Nature',
    publication: 'South Bend Tribune',
    date: '2024-03-15',
    url: '#',
  },
]

export const mockGalleryInfo = {
  name: 'Gallery 1882',
  tagline: 'Contemporary Art in the Heart of the Indiana Dunes',
  description:
    'Gallery 1882 is a contemporary art space dedicated to showcasing works that explore the intersection of art, nature, and the unique landscape of the Indiana Dunes region.',
  address: '123 Dune Drive, Chesterton, IN 46304',
  phone: '(219) 555-0188',
  email: 'info@gallery1882.org',
  hours: 'Wednesday - Sunday, 10 AM - 6 PM',
  admission: 'Free',
}
