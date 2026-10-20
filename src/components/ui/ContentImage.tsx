import Image from 'next/image'

interface ContentImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

function canOptimize(src: string): boolean {
  if (src.startsWith('/')) return true
  try {
    const host = new URL(src).hostname
    return host.endsWith('.supabase.co')
  } catch {
    return false
  }
}

export default function ContentImage({ src, alt, className, priority = false }: ContentImageProps) {
  if (!canOptimize(src)) {
    return <img src={src} alt={alt} className={className} />
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="(max-width: 768px) 100vw, 960px"
      className={className}
    />
  )
}
