import ky from 'ky'

export const httpClient = ky.create({
  prefixUrl: 'https://pubchem.ncbi.nlm.nih.gov',
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
})
