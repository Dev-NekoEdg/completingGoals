import { environment } from './../environments/environment';
export const pagination = {

  sizes: [5, 10, 15, 20],
  defaultSize: 10

}

export const endpoints = {
  baseUrl: `${environment.apiUrl}/api/v1/`,
  list: 'lists/',
  listDetails: 'lists-items/'
}

export const imageDefault = {
  imageNotFound_BlobStorage: 'https://storedatanekoedg.blob.core.windows.net/public-container/goalsList/imageNotFound.png',
  imageNotFound: 'assets/ai_imageNotFound.png'
}