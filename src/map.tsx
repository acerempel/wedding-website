export function GoogleMap({name, place_id}: {name: string, place_id: string}) {
  return (
    <details>
      <summary>Show map to {name}</summary>
      <div class="flex justify-center">
        <iframe
        width="358" height="250"
        frameborder="0" class="border-0"
        loading="lazy"
        src={`https://www.google.com/maps/embed/v1/place?q=place_id:${place_id}&key=AIzaSyD0nXcUaXvggMnKByvgGL6O5QnhzLiOV2s`}
        ></iframe>
      </div>
    </details>
  )
}
