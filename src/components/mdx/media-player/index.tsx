"use client";

import { useDirection } from "@radix-ui/react-direction";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Slot } from "@radix-ui/react-slot";
import {
  AlertTriangleIcon,
  CaptionsIcon,
  CaptionsOffIcon,
  CheckIcon,
  DownloadIcon,
  FastForwardIcon,
  Loader2Icon,
  Maximize2Icon,
  Minimize2Icon,
  PauseIcon,
  PictureInPicture2Icon,
  PictureInPictureIcon,
  PlayIcon,
  RepeatIcon,
  RewindIcon,
  SettingsIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import {
  MediaActionTypes,
  MediaProvider,
  useMediaDispatch,
  useMediaFullscreenRef,
  useMediaRef,
  useMediaSelector,
} from "media-chrome/react/media-store";
import type * as React from "react";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { useComposedRefs } from "@/lib/compose-refs";
import { cn } from "@/utils/cn";
import { useLazyRef } from "@/hooks/use-lazy-ref";

const ROOT_NAME = "MediaPlayer";
const SEEK_NAME = "MediaPlayerSeek";
const SETTINGS_NAME = "MediaPlayerSettings";
const VOLUME_NAME = "MediaPlayerVolume";
const PLAYBACK_SPEED_NAME = "MediaPlayerPlaybackSpeed";

const FLOATING_MENU_SIDE_OFFSET = 10;
const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SEEK_STEP_SHORT = 5;
const SEEK_STEP_LONG = 10;

const sharpIconProps = {
  strokeWidth: 1.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
} satisfies React.SVGProps<SVGSVGElement>;

interface YouTubeEmbedInfo {
  embedUrl: string;
}

interface DivProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

type RootElement = React.ComponentRef<typeof MediaPlayer>;
type Direction = "ltr" | "rtl";

interface StoreState {
  controlsVisible: boolean;
  dragging: boolean;
  menuOpen: boolean;
  volumeIndicatorVisible: boolean;
}

interface Store {
  subscribe: (callback: () => void) => () => void;
  getSnapshot: () => StoreState;
  setState: (
    update: Partial<StoreState> | ((prev: StoreState) => Partial<StoreState>)
  ) => void;
}

const createStore = (initialState: StoreState): Store => {
  let state = initialState;
  const listeners = new Set<() => void>();

  return {
    subscribe: (callback: () => void) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot: () => state,
    setState: (update) => {
      const newState = typeof update === "function" ? update(state) : update;
      state = { ...state, ...newState };
      listeners.forEach((listener) => listener());
    },
  };
};

const useStore = <T,>(store: Store, selector: (state: StoreState) => T): T => {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getSnapshot())
  );
};

interface MediaPlayerContextValue {
  store: Store;
  rootRef: React.RefObject<RootElement | null>;
  controlsIdRef: React.RefObject<string | null>;
  controlsTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>;
  direction: Direction;
}

const MediaPlayerContext = createContext<MediaPlayerContextValue | null>(null);

const useMediaPlayerContext = (componentName: string) => {
  const context = useContext(MediaPlayerContext);
  if (!context) {
    throw new Error(`\`${componentName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
};

interface MediaPlayerProps extends DivProps {
  defaultControlsVisible?: boolean;
  controlsVisibleDuration?: number;
  keyboardControls?: boolean;
}

interface MediaPlayerInnerProps extends MediaPlayerProps {
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}

const MediaPlayerInner = ({
  forwardedRef,
  asChild,
  defaultControlsVisible = true,
  controlsVisibleDuration = 2500,
  keyboardControls = true,
  className,
  onPointerMove,
  onPointerLeave,
  onKeyDown,
  children,
  ...props
}: MediaPlayerInnerProps) => {
  const fullscreenRef = useMediaFullscreenRef();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlsIdRef = useRef<string | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const direction = useDirection() ?? "ltr";

  const storeRef = useLazyRef(() =>
    createStore({
      controlsVisible: defaultControlsVisible,
      dragging: false,
      menuOpen: false,
      volumeIndicatorVisible: false,
    })
  );
  const store = storeRef.current;

  const mediaIsPaused = useMediaSelector((state) => state.mediaPaused);
  const dragging = useStore(store, (state) => state.dragging);
  const menuOpen = useStore(store, (state) => state.menuOpen);

  const dispatch = useMediaDispatch();

  const composedRef = useComposedRefs(forwardedRef, rootRef, fullscreenRef);

  const showControls = useCallback(() => {
    store.setState({ controlsVisible: true });
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    controlsTimerRef.current = setTimeout(() => {
      if (store.getSnapshot().dragging || store.getSnapshot().menuOpen) return;
      store.setState({ controlsVisible: false });
    }, controlsVisibleDuration);
  }, [store, controlsVisibleDuration]);

  const hideControls = useCallback(() => {
    if (mediaIsPaused || dragging || menuOpen) return;
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    store.setState({ controlsVisible: false });
  }, [mediaIsPaused, dragging, menuOpen, store]);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerMove?.(event);
      showControls();
    },
    [onPointerMove, showControls]
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      hideControls();
    },
    [onPointerLeave, hideControls]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (!keyboardControls) return;

      const targetElement = event.target instanceof HTMLElement ? event.target : null;
      if (
        targetElement?.closest("input") ||
        targetElement?.closest("textarea") ||
        targetElement?.closest('[role="listbox"]') ||
        targetElement?.closest('[role="menu"]')
      ) {
        return;
      }

      const mediaElement = rootRef.current?.querySelector("video, audio");
      if (!(mediaElement instanceof HTMLVideoElement) && !(mediaElement instanceof HTMLAudioElement)) {
        return;
      }

      const isVideoPlayer = mediaElement.tagName === "VIDEO";

      switch (event.key) {
        case " ":
        case "k":
        case "K":
          event.preventDefault();
          dispatch({
            type: mediaElement.paused
              ? MediaActionTypes.MEDIA_PLAY_REQUEST
              : MediaActionTypes.MEDIA_PAUSE_REQUEST,
          });
          showControls();
          break;
        case "ArrowRight":
          if (event.shiftKey || isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_SEEK_REQUEST,
              detail: Math.min(mediaElement.currentTime + SEEK_STEP_SHORT, mediaElement.duration),
            });
            showControls();
          }
          break;
        case "ArrowLeft":
          if (event.shiftKey || isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_SEEK_REQUEST,
              detail: Math.max(mediaElement.currentTime - SEEK_STEP_SHORT, 0),
            });
            showControls();
          }
          break;
        case "j":
        case "J":
          if (isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_SEEK_REQUEST,
              detail: Math.max(mediaElement.currentTime - SEEK_STEP_LONG, 0),
            });
            showControls();
          }
          break;
        case "l":
        case "L":
          if (isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_SEEK_REQUEST,
              detail: Math.min(mediaElement.currentTime + SEEK_STEP_LONG, mediaElement.duration),
            });
            showControls();
          }
          break;
        case "ArrowUp":
          if (isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
              detail: Math.min(mediaElement.volume + 0.1, 1),
            });
            showControls();
            store.setState({ volumeIndicatorVisible: true });
            setTimeout(() => store.setState({ volumeIndicatorVisible: false }), 1000);
          }
          break;
        case "ArrowDown":
          if (isVideoPlayer) {
            event.preventDefault();
            dispatch({
              type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
              detail: Math.max(mediaElement.volume - 0.1, 0),
            });
            showControls();
            store.setState({ volumeIndicatorVisible: true });
            setTimeout(() => store.setState({ volumeIndicatorVisible: false }), 1000);
          }
          break;
        case "m":
        case "M":
          event.preventDefault();
          dispatch({
            type: mediaElement.muted
              ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
              : MediaActionTypes.MEDIA_MUTE_REQUEST,
          });
          showControls();
          break;
        case "r":
        case "R":
          event.preventDefault();
          dispatch({
            type: MediaActionTypes.MEDIA_LOOP_REQUEST,
            detail: !mediaElement.loop,
          });
          showControls();
          break;
        case "f":
        case "F":
          event.preventDefault();
          dispatch({
            type: document.fullscreenElement
              ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
              : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST,
          });
          showControls();
          break;
        case "Escape":
          if (document.fullscreenElement) {
            event.preventDefault();
            dispatch({ type: MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST });
            showControls();
          }
          break;
        case ">":
          event.preventDefault();
          dispatch({
            type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
            detail: Math.min(mediaElement.playbackRate + 0.25, 2),
          });
          showControls();
          break;
        case "<":
          event.preventDefault();
          dispatch({
            type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
            detail: Math.max(mediaElement.playbackRate - 0.25, 0.25),
          });
          showControls();
          break;
        case "p":
        case "P":
          event.preventDefault();
          if (mediaElement instanceof HTMLVideoElement) {
            if (document.pictureInPictureElement) {
              document.exitPictureInPicture();
            } else {
              mediaElement.requestPictureInPicture();
            }
          }
          showControls();
          break;
        case "c":
        case "C": {
          event.preventDefault();
          const captionsButton = rootRef.current?.querySelector(
            '[data-slot="media-player-captions"]'
          );
          if (captionsButton instanceof HTMLButtonElement) {
            captionsButton.click();
          }
          showControls();
          break;
        }
        case "d":
        case "D": {
          event.preventDefault();
          const downloadButton = rootRef.current?.querySelector(
            "[data-media-player-download]"
          );
          if (downloadButton instanceof HTMLAnchorElement) {
            downloadButton.click();
          }
          showControls();
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          event.preventDefault();
          const percent = Number.parseInt(event.key) / 10;
          dispatch({
            type: MediaActionTypes.MEDIA_SEEK_REQUEST,
            detail: mediaElement.duration * percent,
          });
          showControls();
          break;
        }
        case "Home":
          event.preventDefault();
          dispatch({
            type: MediaActionTypes.MEDIA_SEEK_REQUEST,
            detail: 0,
          });
          showControls();
          break;
        case "End":
          event.preventDefault();
          dispatch({
            type: MediaActionTypes.MEDIA_SEEK_REQUEST,
            detail: mediaElement.duration,
          });
          showControls();
          break;
      }
    },
    [onKeyDown, keyboardControls, dispatch, showControls, store]
  );

  useEffect(() => {
    showControls();
  }, [showControls]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

  const Comp = asChild ? Slot : "div";

  return (
    <MediaPlayerContext.Provider
      value={{
        store,
        rootRef,
        controlsIdRef,
        controlsTimerRef,
        direction,
      }}
    >
      <Comp
        ref={composedRef}
        data-slot="media-player"
        tabIndex={0}
        className={cn("bg-background group relative flex flex-col overflow-hidden outline-none", className)}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Comp>
    </MediaPlayerContext.Provider>
  );
};

const MediaPlayer = forwardRef<HTMLDivElement, MediaPlayerProps>((props, forwardedRef) => {
  return (
    <MediaProvider>
      <MediaPlayerInner {...props} forwardedRef={forwardedRef} />
    </MediaProvider>
  );
});
MediaPlayer.displayName = ROOT_NAME;

interface MediaPlayerVideoProps extends React.ComponentPropsWithoutRef<"video"> {
  asChild?: boolean;
}

const MediaPlayerVideo = forwardRef<HTMLVideoElement, MediaPlayerVideoProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const mediaRef = useMediaRef();
    const composedRef = useComposedRefs(forwardedRef, mediaRef);
    const dispatch = useMediaDispatch();
    const mediaIsPaused = useMediaSelector((state) => state.mediaPaused);

    const handleClick = useCallback(() => {
      dispatch({
        type: mediaIsPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST,
      });
    }, [dispatch, mediaIsPaused]);

    const Comp = asChild ? Slot : "video";

    return (
      <Comp
        ref={composedRef}
        data-slot="media-player-video"
        playsInline
        className={cn("aspect-video size-full", className)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
MediaPlayerVideo.displayName = "MediaPlayerVideo";

interface MediaPlayerAudioProps extends React.ComponentPropsWithoutRef<"audio"> {
  asChild?: boolean;
}

const MediaPlayerAudio = forwardRef<HTMLAudioElement, MediaPlayerAudioProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const mediaRef = useMediaRef();
    const composedRef = useComposedRefs(forwardedRef, mediaRef);

    const Comp = asChild ? Slot : "audio";

    return (
      <Comp
        ref={composedRef}
        data-slot="media-player-audio"
        className={cn("sr-only", className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
MediaPlayerAudio.displayName = "MediaPlayerAudio";

const MediaPlayerControls = forwardRef<HTMLDivElement, DivProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { store, controlsIdRef } = useMediaPlayerContext("MediaPlayerControls");
    const controlsId = useId();
    const controlsRef = useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs(forwardedRef, controlsRef);
    const controlsVisible = useStore(store, (state) => state.controlsVisible);
    const dragging = useStore(store, (state) => state.dragging);
    const menuOpen = useStore(store, (state) => state.menuOpen);
    const mediaIsPaused = useMediaSelector((state) => state.mediaPaused);

    useEffect(() => {
      controlsIdRef.current = controlsId;
      return () => {
        controlsIdRef.current = null;
      };
    }, [controlsId, controlsIdRef]);

    const shouldShowControls = controlsVisible || dragging || menuOpen || mediaIsPaused;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={composedRef}
        data-slot="media-player-controls"
        data-visible={shouldShowControls}
        className={cn(
          "absolute inset-x-0 bottom-0 flex w-full items-center gap-1 px-2 py-2 transition-opacity duration-200",
          shouldShowControls ? "opacity-100" : "pointer-events-none opacity-0",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
MediaPlayerControls.displayName = "MediaPlayerControls";

const MediaPlayerControlsOverlay = forwardRef<HTMLDivElement, DivProps>(
  ({ asChild, className, ...props }, forwardedRef) => {
    const { store } = useMediaPlayerContext("MediaPlayerControlsOverlay");
    const controlsVisible = useStore(store, (state) => state.controlsVisible);
    const dragging = useStore(store, (state) => state.dragging);
    const menuOpen = useStore(store, (state) => state.menuOpen);
    const mediaIsPaused = useMediaSelector((state) => state.mediaPaused);

    const shouldShowControls = controlsVisible || dragging || menuOpen || mediaIsPaused;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-controls-overlay"
        data-visible={shouldShowControls}
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-200",
          shouldShowControls ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    );
  }
);
MediaPlayerControlsOverlay.displayName = "MediaPlayerControlsOverlay";

const MediaPlayerLoading = forwardRef<HTMLDivElement, DivProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerLoading");
    const mediaLoading = useMediaSelector((state) => state.mediaLoading);
    const mediaError = useMediaSelector((state) => state.mediaError);
    const [mediaReadyState, setMediaReadyState] = useState<number | null>(null);

    const Comp = asChild ? Slot : "div";

    useEffect(() => {
      const updateMediaReadyState = () => {
        const mediaElement = rootRef.current?.querySelector("video, audio");
        if (
          !(mediaElement instanceof HTMLVideoElement) &&
          !(mediaElement instanceof HTMLAudioElement)
        ) {
          setMediaReadyState(null);
          return;
        }

        setMediaReadyState(mediaElement.readyState);
      };

      updateMediaReadyState();

      const mediaElement = rootRef.current?.querySelector("video, audio");
      if (
        !(mediaElement instanceof HTMLVideoElement) &&
        !(mediaElement instanceof HTMLAudioElement)
      ) {
        return;
      }

      const events: Array<keyof HTMLMediaElementEventMap> = [
        "loadstart",
        "loadedmetadata",
        "loadeddata",
        "canplay",
        "canplaythrough",
        "playing",
        "waiting",
        "stalled",
        "emptied",
        "error",
      ];

      events.forEach((eventName) => {
        mediaElement.addEventListener(eventName, updateMediaReadyState);
      });

      return () => {
        events.forEach((eventName) => {
          mediaElement.removeEventListener(eventName, updateMediaReadyState);
        });
      };
    }, [rootRef]);

    const shouldShowLoading =
      !mediaError && (mediaReadyState === null ? mediaLoading : mediaReadyState < 3);

    if (!shouldShowLoading) return null;

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-loading"
        className={cn(
          "bg-background/80 pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
          className
        )}
        {...props}
      >
        {children ?? (
          <Loader2Icon {...sharpIconProps} className="text-foreground size-12 animate-spin" />
        )}
      </Comp>
    );
  }
);
MediaPlayerLoading.displayName = "MediaPlayerLoading";

interface MediaPlayerErrorProps extends DivProps {
  onRetry?: () => void;
}

const MediaPlayerError = forwardRef<HTMLDivElement, MediaPlayerErrorProps>(
  ({ asChild, className, onRetry, children, ...props }, forwardedRef) => {
    const mediaError = useMediaSelector((state) => state.mediaError);

    const Comp = asChild ? Slot : "div";

    if (!mediaError) return null;

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-error"
        className={cn(
          "bg-background/80 absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 p-4",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <AlertTriangleIcon {...sharpIconProps} className="text-destructive size-12" />
            <p className="text-foreground text-center text-sm">
              An error occurred while loading the media.
            </p>
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry}>
                Try Again
              </Button>
            )}
          </>
        )}
      </Comp>
    );
  }
);
MediaPlayerError.displayName = "MediaPlayerError";

const MediaPlayerVolumeIndicator = forwardRef<HTMLDivElement, DivProps>(
  ({ asChild, className, ...props }, forwardedRef) => {
    const { store } = useMediaPlayerContext("MediaPlayerVolumeIndicator");
    const volumeIndicatorVisible = useStore(store, (state) => state.volumeIndicatorVisible);
    const mediaVolume = useMediaSelector((state) => state.mediaVolume);
    const mediaMuted = useMediaSelector((state) => state.mediaMuted);

    const Comp = asChild ? Slot : "div";

    if (!volumeIndicatorVisible) return null;

    const displayVolume = mediaMuted ? 0 : Math.round((mediaVolume ?? 1) * 100);

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-volume-indicator"
        className={cn(
          "bg-background/80 pointer-events-none absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 px-3 py-2",
          className
        )}
        {...props}
      >
        {mediaMuted || displayVolume === 0 ? (
          <VolumeXIcon className="size-5" />
        ) : displayVolume < 50 ? (
          <Volume1Icon className="size-5" />
        ) : (
          <Volume2Icon className="size-5" />
        )}
        <span className="min-w-[3ch] text-sm font-medium">{displayVolume}%</span>
      </Comp>
    );
  }
);
MediaPlayerVolumeIndicator.displayName = "MediaPlayerVolumeIndicator";

interface MediaPlayerPlayProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const MediaPlayerPlay = forwardRef<HTMLButtonElement, MediaPlayerPlayProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerPlay");
    const mediaIsPaused = useMediaSelector((state) => state.mediaPaused);
    const mediaEnded = useMediaSelector((state) => state.mediaEnded);
    const dispatch = useMediaDispatch();

    const handleClick = useCallback(() => {
      dispatch({
        type: mediaIsPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST,
      });
    }, [dispatch, mediaIsPaused]);

    const Comp = asChild ? Slot : Button;

    const icon = mediaEnded ? (
      <PlayIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    ) : mediaIsPaused ? (
      <PlayIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    ) : (
      <PauseIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    );

    const label = mediaEnded ? "Replay" : mediaIsPaused ? "Play" : "Pause";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-play"
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={label}
            {...props}
          >
            {children ?? icon}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerPlay.displayName = "MediaPlayerPlay";

interface MediaPlayerSeekButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
  seconds?: number;
}

const MediaPlayerSeekBackward = forwardRef<HTMLButtonElement, MediaPlayerSeekButtonProps>(
  ({ asChild, seconds = 10, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerSeekBackward");
    const dispatch = useMediaDispatch();
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);

    const handleClick = useCallback(() => {
      dispatch({
        type: MediaActionTypes.MEDIA_SEEK_REQUEST,
        detail: Math.max((mediaCurrentTime ?? 0) - seconds, 0),
      });
    }, [dispatch, mediaCurrentTime, seconds]);

    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-seek-backward"
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={`Seek backward ${seconds} seconds`}
            {...props}
          >
            {children ?? <RewindIcon {...sharpIconProps} className="size-5 drop-shadow-md" />}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          Seek backward {seconds}s
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerSeekBackward.displayName = "MediaPlayerSeekBackward";

const MediaPlayerSeekForward = forwardRef<HTMLButtonElement, MediaPlayerSeekButtonProps>(
  ({ asChild, seconds = 10, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerSeekForward");
    const dispatch = useMediaDispatch();
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
    const mediaDuration = useMediaSelector((state) => state.mediaDuration);

    const handleClick = useCallback(() => {
      dispatch({
        type: MediaActionTypes.MEDIA_SEEK_REQUEST,
        detail: Math.min((mediaCurrentTime ?? 0) + seconds, mediaDuration ?? Infinity),
      });
    }, [dispatch, mediaCurrentTime, mediaDuration, seconds]);

    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-seek-forward"
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={`Seek forward ${seconds} seconds`}
            {...props}
          >
            {children ?? (
              <FastForwardIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
            )}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          Seek forward {seconds}s
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerSeekForward.displayName = "MediaPlayerSeekForward";

const SEEK_TOOLTIP_WIDTH_FALLBACK = 240;
const SEEK_COLLISION_PADDING = 10;
const SPRITE_CONTAINER_WIDTH = 160;
const SPRITE_CONTAINER_HEIGHT = 90;

interface Storyboard {
  url: string;
  tileWidth: number;
  tileHeight: number;
  tileCount: number;
  columns: number;
}

interface MediaPlayerSeekProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  asChild?: boolean;
  storyboard?: Storyboard;
}

type MediaPlayerSeekElement = React.ElementRef<typeof SliderPrimitive.Root>;
type MediaPlayerSeekPointerEvent = Parameters<
  NonNullable<MediaPlayerSeekProps["onPointerDown"]>
>[0];

const MediaPlayerSeek = forwardRef<MediaPlayerSeekElement, MediaPlayerSeekProps>(
  ({ asChild, storyboard, className, onPointerDown, onPointerUp, ...props }, forwardedRef) => {
    const { store, direction, rootRef } = useMediaPlayerContext(SEEK_NAME);
    const trackRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
    const mediaDuration = useMediaSelector((state) => state.mediaDuration);
    const mediaBuffered = useMediaSelector((state) => state.mediaBuffered);
    const dispatch = useMediaDispatch();

    const [hoverPercent, setHoverPercent] = useState<number | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    const currentTime = mediaCurrentTime ?? 0;
    const duration = mediaDuration ?? 0;
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const bufferedPercent = useMemo(() => {
      const bufferedRanges = (mediaBuffered ?? []) as [number, number][];
      if (bufferedRanges.length === 0 || duration === 0) return 0;
      const lastRange = bufferedRanges[bufferedRanges.length - 1];
      if (!lastRange) return 0;
      const [, endTime] = lastRange;
      return (endTime / duration) * 100;
    }, [mediaBuffered, duration]);

    const handleValueChange = useCallback(
      (value: number[]) => {
        if (value[0] === undefined) return;
        const newTime = (value[0] / 100) * duration;
        dispatch({
          type: MediaActionTypes.MEDIA_SEEK_REQUEST,
          detail: newTime,
        });
      },
      [dispatch, duration]
    );

    const handlePointerDown = useCallback(
      (event: MediaPlayerSeekPointerEvent) => {
        onPointerDown?.(event);
        store.setState({ dragging: true });
      },
      [onPointerDown, store]
    );

    const handlePointerUp = useCallback(
      (event: MediaPlayerSeekPointerEvent) => {
        onPointerUp?.(event);
        store.setState({ dragging: false });
      },
      [onPointerUp, store]
    );

    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLSpanElement>) => {
        const track = trackRef.current;
        if (!track) return;

        const rect = track.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setHoverPercent(percent);

        const tooltipWidth = tooltipRef.current?.offsetWidth ?? SEEK_TOOLTIP_WIDTH_FALLBACK;
        const containerWidth = rootRef.current?.offsetWidth ?? rect.width;
        const halfTooltip = tooltipWidth / 2;

        let tooltipX = x;
        if (tooltipX - halfTooltip < SEEK_COLLISION_PADDING) {
          tooltipX = halfTooltip + SEEK_COLLISION_PADDING;
        } else if (tooltipX + halfTooltip > containerWidth - SEEK_COLLISION_PADDING) {
          tooltipX = containerWidth - halfTooltip - SEEK_COLLISION_PADDING;
        }

        setTooltipPosition({ x: tooltipX, y: rect.top - 8 });
      },
      [rootRef]
    );

    const handlePointerLeave = useCallback(() => {
      setHoverPercent(null);
    }, []);

    const formatTime = (time: number) => {
      if (!Number.isFinite(time) || time < 0) return "0:00";
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const hoverTime = hoverPercent !== null ? (hoverPercent / 100) * duration : 0;

    const spritePosition = useMemo(() => {
      if (!storyboard || hoverPercent === null) return null;
      const { tileWidth, tileHeight, tileCount, columns, url } = storyboard;
      const tileIndex = Math.min(Math.floor((hoverPercent / 100) * tileCount), tileCount - 1);
      const col = tileIndex % columns;
      const row = Math.floor(tileIndex / columns);
      return {
        url,
        x: col * tileWidth,
        y: row * tileHeight,
        width: tileWidth,
        height: tileHeight,
      };
    }, [storyboard, hoverPercent]);

    const Comp = (asChild ? Slot : SliderPrimitive.Root) as typeof SliderPrimitive.Root;

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-seek"
        value={[progress]}
        max={100}
        step={0.1}
        dir={direction}
        className={cn("group/seek relative flex h-5 w-full touch-none items-center select-none", className)}
        onValueChange={handleValueChange}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        {...props}
      >
        <SliderPrimitive.Track
          ref={trackRef}
          className="relative h-1 w-full grow cursor-pointer overflow-hidden bg-white/20 transition-[height] group-hover/seek:h-1.5"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div
            data-slot="media-player-seek-buffer"
            className="absolute h-full bg-white/40 transition-[width]"
            style={{ width: `${bufferedPercent}%` }}
          />
          <SliderPrimitive.Range className="absolute h-full bg-white" />
          {hoverPercent !== null && (
            <div
              data-slot="media-player-seek-hover"
              className="pointer-events-none absolute h-full bg-white/20"
              style={{ width: `${hoverPercent}%` }}
            />
          )}
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block size-3.5 cursor-grab bg-white opacity-0 shadow-lg ring-2 ring-white/20 transition-opacity focus-visible:outline-none active:cursor-grabbing group-hover/seek:opacity-100" />
        {hoverPercent !== null && (
          <div
            ref={tooltipRef}
            data-slot="media-player-seek-tooltip"
            className="pointer-events-none absolute bottom-full mb-2 flex -translate-x-1/2 flex-col items-center gap-1"
            style={{ left: tooltipPosition.x }}
          >
            {spritePosition && (
              <div
                data-slot="media-player-seek-thumbnail"
                className="overflow-hidden border border-white/20 bg-black shadow-lg"
                style={{
                  width: SPRITE_CONTAINER_WIDTH,
                  height: SPRITE_CONTAINER_HEIGHT,
                }}
              >
                <div
                  style={{
                    width: spritePosition.width,
                    height: spritePosition.height,
                    backgroundImage: `url(${spritePosition.url})`,
                    backgroundPosition: `-${spritePosition.x}px -${spritePosition.y}px`,
                    transform: `scale(${SPRITE_CONTAINER_WIDTH / spritePosition.width})`,
                    transformOrigin: "top left",
                  }}
                />
              </div>
            )}
            <span className="bg-black/80 px-2 py-1 text-xs font-medium tabular-nums text-white">
              {formatTime(hoverTime)}
            </span>
          </div>
        )}
      </Comp>
    );
  }
);
MediaPlayerSeek.displayName = SEEK_NAME;

interface MediaPlayerVolumeProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  expandable?: boolean;
}

const MediaPlayerVolume = forwardRef<HTMLDivElement, MediaPlayerVolumeProps>(
  ({ asChild, expandable = false, className, ...props }, forwardedRef) => {
    const { rootRef, direction } = useMediaPlayerContext(VOLUME_NAME);
    const [isExpanded, setIsExpanded] = useState(false);
    const mediaVolume = useMediaSelector((state) => state.mediaVolume);
    const mediaMuted = useMediaSelector((state) => state.mediaMuted);
    const dispatch = useMediaDispatch();

    const volume = mediaMuted ? 0 : (mediaVolume ?? 1) * 100;

    const handleMuteToggle = useCallback(() => {
      dispatch({
        type: mediaMuted
          ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
          : MediaActionTypes.MEDIA_MUTE_REQUEST,
      });
    }, [dispatch, mediaMuted]);

    const handleVolumeChange = useCallback(
      (value: number[]) => {
        if (value[0] === undefined) return;
        const newVolume = value[0] / 100;
        dispatch({
          type: MediaActionTypes.MEDIA_VOLUME_REQUEST,
          detail: newVolume,
        });
        if (mediaMuted && newVolume > 0) {
          dispatch({ type: MediaActionTypes.MEDIA_UNMUTE_REQUEST });
        }
      },
      [dispatch, mediaMuted]
    );

    const VolumeIcon =
      volume === 0 || mediaMuted ? VolumeXIcon : volume < 50 ? Volume1Icon : Volume2Icon;

    const label = mediaMuted ? "Unmute" : "Mute";

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-volume"
        className={cn("flex items-center gap-1", className)}
        onMouseEnter={() => expandable && setIsExpanded(true)}
        onMouseLeave={() => expandable && setIsExpanded(false)}
        {...props}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/25 hover:text-white"
              onClick={handleMuteToggle}
              aria-label={label}
            >
              <VolumeIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
            </Button>
          </TooltipTrigger>
          <TooltipContent variant="inverse" container={rootRef.current}>
            {label}
          </TooltipContent>
        </Tooltip>
        {(!expandable || isExpanded) && (
          <SliderPrimitive.Root
            value={[volume]}
            max={100}
            step={1}
            dir={direction}
            className={cn(
              "relative flex h-5 touch-none items-center select-none transition-all",
              expandable ? "w-20" : "w-20"
            )}
            onValueChange={handleVolumeChange}
          >
            <SliderPrimitive.Track className="relative h-1 w-full grow cursor-pointer overflow-hidden bg-white/40">
              <SliderPrimitive.Range className="absolute h-full bg-white" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb className="block size-3 cursor-grab bg-white shadow-lg focus-visible:outline-none active:cursor-grabbing" />
          </SliderPrimitive.Root>
        )}
      </Comp>
    );
  }
);
MediaPlayerVolume.displayName = VOLUME_NAME;

interface MediaPlayerMuteProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const MediaPlayerMute = forwardRef<HTMLButtonElement, MediaPlayerMuteProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerMute");
    const mediaMuted = useMediaSelector((state) => state.mediaMuted);
    const mediaVolume = useMediaSelector((state) => state.mediaVolume);
    const dispatch = useMediaDispatch();

    const handleClick = useCallback(() => {
      dispatch({
        type: mediaMuted
          ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
          : MediaActionTypes.MEDIA_MUTE_REQUEST,
      });
    }, [dispatch, mediaMuted]);

    const Comp = asChild ? Slot : Button;

    const volumePercent = Math.round((mediaVolume ?? 1) * 100);
    const VolumeIcon =
      mediaMuted || volumePercent === 0
        ? VolumeXIcon
        : volumePercent < 50
          ? Volume1Icon
          : Volume2Icon;

    const label = mediaMuted ? "Unmute" : "Mute";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-mute"
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={label}
            {...props}
          >
            {children ?? <VolumeIcon {...sharpIconProps} className="size-5 drop-shadow-md" />}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerMute.displayName = "MediaPlayerMute";

interface MediaPlayerTimeProps extends React.ComponentPropsWithoutRef<"span"> {
  asChild?: boolean;
  variant?: "progress" | "duration" | "remaining";
}

const MediaPlayerTime = forwardRef<HTMLSpanElement, MediaPlayerTimeProps>(
  ({ asChild, variant = "progress", className, ...props }, forwardedRef) => {
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
    const mediaDuration = useMediaSelector((state) => state.mediaDuration);

    const currentTime = mediaCurrentTime ?? 0;
    const duration = mediaDuration ?? 0;

    const formatTime = (time: number) => {
      if (!Number.isFinite(time) || time < 0) return "0:00";
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    let displayTime = "";
    switch (variant) {
      case "progress":
        displayTime = `${formatTime(currentTime)}/${formatTime(duration)}`;
        break;
      case "duration":
        displayTime = formatTime(duration);
        break;
      case "remaining":
        displayTime = `-${formatTime(duration - currentTime)}`;
        break;
    }

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-time"
        className={cn("text-sm tabular-nums text-white drop-shadow-md", className)}
        {...props}
      >
        {displayTime}
      </Comp>
    );
  }
);
MediaPlayerTime.displayName = "MediaPlayerTime";

interface MediaPlayerPlaybackSpeedProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
  speeds?: number[];
}

const MediaPlayerPlaybackSpeed = forwardRef<HTMLButtonElement, MediaPlayerPlaybackSpeedProps>(
  ({ asChild, speeds = SPEEDS, className, children, ...props }, forwardedRef) => {
    const { store, rootRef } = useMediaPlayerContext(PLAYBACK_SPEED_NAME);
    const mediaPlaybackRate = useMediaSelector((state) => state.mediaPlaybackRate);
    const dispatch = useMediaDispatch();

    const currentSpeed = mediaPlaybackRate ?? 1;

    const handleSpeedChange = useCallback(
      (speed: number) => {
        dispatch({
          type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
          detail: speed,
        });
      },
      [dispatch]
    );

    const handleOpenChange = useCallback(
      (open: boolean) => {
        store.setState({ menuOpen: open });
      },
      [store]
    );

    const Comp = asChild ? Slot : Button;

    return (
      <Tooltip>
        <DropdownMenu onOpenChange={handleOpenChange}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Comp
                ref={forwardedRef}
                data-slot="media-player-playback-speed"
                variant="ghost"
                size="icon-sm"
                className={cn("text-white hover:bg-white/25 hover:text-white", className)}
                aria-label="Playback speed"
                {...props}
              >
                {children ?? <span className="drop-shadow-md">{currentSpeed}x</span>}
              </Comp>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent container={rootRef.current} sideOffset={FLOATING_MENU_SIDE_OFFSET}>
            <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
            {speeds.map((speed) => (
              <DropdownMenuItem key={speed} onClick={() => handleSpeedChange(speed)}>
                <span className="flex-1">{speed}x</span>
                {currentSpeed === speed && <CheckIcon {...sharpIconProps} className="size-4" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent variant="inverse" container={rootRef.current}>
          Playback speed
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerPlaybackSpeed.displayName = PLAYBACK_SPEED_NAME;

interface MediaPlayerLoopProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const MediaPlayerLoop = forwardRef<HTMLButtonElement, MediaPlayerLoopProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerLoop");
    const mediaLoop = useMediaSelector((state) => state.mediaLoop);
    const dispatch = useMediaDispatch();

    const handleClick = useCallback(() => {
      dispatch({
        type: MediaActionTypes.MEDIA_LOOP_REQUEST,
        detail: !mediaLoop,
      });
    }, [dispatch, mediaLoop]);

    const Comp = asChild ? Slot : Button;

    const label = mediaLoop ? "Disable loop" : "Enable loop";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-loop"
            data-state={mediaLoop ? "on" : "off"}
            variant="ghost"
            size="icon-sm"
            className={cn(
              "text-white hover:bg-white/25 hover:text-white",
              mediaLoop && "bg-white/25",
              className
            )}
            onClick={handleClick}
            aria-label={label}
            {...props}
          >
            {children ?? <RepeatIcon {...sharpIconProps} className="size-5 drop-shadow-md" />}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerLoop.displayName = "MediaPlayerLoop";

interface MediaPlayerFullscreenProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const MediaPlayerFullscreen = forwardRef<HTMLButtonElement, MediaPlayerFullscreenProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerFullscreen");
    const mediaIsFullscreen = useMediaSelector((state) => state.mediaIsFullscreen);
    const dispatch = useMediaDispatch();

    const handleClick = useCallback(() => {
      dispatch({
        type: mediaIsFullscreen
          ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST,
      });
    }, [dispatch, mediaIsFullscreen]);

    const Comp = asChild ? Slot : Button;

    const icon = mediaIsFullscreen ? (
      <Minimize2Icon {...sharpIconProps} className="size-5 drop-shadow-md" />
    ) : (
      <Maximize2Icon {...sharpIconProps} className="size-5 drop-shadow-md" />
    );

    const label = mediaIsFullscreen ? "Exit fullscreen" : "Enter fullscreen";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-fullscreen"
            data-state={mediaIsFullscreen ? "on" : "off"}
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={label}
            {...props}
          >
            {children ?? icon}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerFullscreen.displayName = "MediaPlayerFullscreen";

interface MediaPlayerPiPProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
  onPipError?: (error: Error) => void;
}

const MediaPlayerPiP = forwardRef<HTMLButtonElement, MediaPlayerPiPProps>(
  ({ asChild, onPipError, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerPiP");
    const mediaIsPip = useMediaSelector((state) => state.mediaIsPip);
    const dispatch = useMediaDispatch();

    const handleClick = useCallback(async () => {
      try {
        dispatch({
          type: mediaIsPip
            ? MediaActionTypes.MEDIA_EXIT_PIP_REQUEST
            : MediaActionTypes.MEDIA_ENTER_PIP_REQUEST,
        });
      } catch (error) {
        if (error instanceof Error) {
          onPipError?.(error);
        }
      }
    }, [dispatch, mediaIsPip, onPipError]);

    const Comp = asChild ? Slot : Button;

    const icon = mediaIsPip ? (
      <PictureInPicture2Icon {...sharpIconProps} className="size-5 drop-shadow-md" />
    ) : (
      <PictureInPictureIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    );

    const label = mediaIsPip ? "Exit picture-in-picture" : "Enter picture-in-picture";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-pip"
            data-state={mediaIsPip ? "on" : "off"}
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            aria-label={label}
            {...props}
          >
            {children ?? icon}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerPiP.displayName = "MediaPlayerPiP";

interface MediaPlayerCaptionsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
}

const MediaPlayerCaptions = forwardRef<HTMLButtonElement, MediaPlayerCaptionsProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerCaptions");
    const mediaSubtitlesList = useMediaSelector((state) => state.mediaSubtitlesList);
    const mediaSubtitlesShowing = useMediaSelector((state) => state.mediaSubtitlesShowing);
    const dispatch = useMediaDispatch();

    const hasSubtitles = Boolean(mediaSubtitlesList && mediaSubtitlesList.length > 0);
    const isShowingCaptions = Boolean(mediaSubtitlesShowing && mediaSubtitlesShowing.length > 0);

    const handleClick = useCallback(() => {
      if (!hasSubtitles) return;

      if (isShowingCaptions) {
        dispatch({ type: MediaActionTypes.MEDIA_DISABLE_SUBTITLES_REQUEST });
      } else {
        const firstTrack = mediaSubtitlesList?.[0];
        if (firstTrack) {
          dispatch({
            type: MediaActionTypes.MEDIA_SHOW_SUBTITLES_REQUEST,
            detail: firstTrack,
          });
        }
      }
    }, [dispatch, hasSubtitles, isShowingCaptions, mediaSubtitlesList]);

    const Comp = asChild ? Slot : Button;

    const icon = isShowingCaptions ? (
      <CaptionsIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    ) : (
      <CaptionsOffIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
    );

    const label = isShowingCaptions ? "Disable captions" : "Enable captions";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-captions"
            data-state={isShowingCaptions ? "on" : "off"}
            variant="ghost"
            size="icon-sm"
            className={cn(
              "text-white hover:bg-white/25 hover:text-white",
              !hasSubtitles && "pointer-events-none opacity-50",
              className
            )}
            onClick={handleClick}
            disabled={!hasSubtitles}
            aria-label={label}
            {...props}
          >
            {children ?? icon}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          {hasSubtitles ? label : "No captions available"}
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerCaptions.displayName = "MediaPlayerCaptions";

interface MediaPlayerDownloadProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
  onDownload?: () => void;
  isLoading?: boolean;
}

const MediaPlayerDownload = forwardRef<HTMLButtonElement, MediaPlayerDownloadProps>(
  ({ asChild, onDownload, isLoading, className, children, ...props }, forwardedRef) => {
    const { rootRef } = useMediaPlayerContext("MediaPlayerDownload");
    const getMediaSrc = useCallback(() => {
      const mediaElement = rootRef.current?.querySelector<HTMLVideoElement | HTMLAudioElement>(
        '[data-slot="media-player-video"], [data-slot="media-player-audio"], video, audio'
      );
      return mediaElement?.currentSrc || mediaElement?.src || null;
    }, [rootRef]);

    const Comp = asChild ? Slot : Button;

    const handleClick = useCallback(() => {
      if (onDownload) {
        onDownload();
        return;
      }

      const src = getMediaSrc();
      if (!src) return;

      const link = document.createElement("a");
      link.href = src;
      link.download = "";
      link.click();
    }, [getMediaSrc, onDownload]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-download"
            data-media-player-download
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            onClick={handleClick}
            disabled={isLoading}
            aria-label="Download"
            {...props}
          >
            {children ??
              (isLoading ? (
                <Loader2Icon {...sharpIconProps} className="size-5 animate-spin drop-shadow-md" />
              ) : (
                <DownloadIcon {...sharpIconProps} className="size-5 drop-shadow-md" />
              ))}
          </Comp>
        </TooltipTrigger>
        <TooltipContent variant="inverse" container={rootRef.current}>
          Download
        </TooltipContent>
      </Tooltip>
    );
  }
);
MediaPlayerDownload.displayName = "MediaPlayerDownload";

interface MediaPlayerSettingsProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean;
  speeds?: number[];
}

interface Rendition {
  src?: string;
  id?: string;
  width?: number;
  height?: number;
  bitrate?: number;
  frameRate?: number;
  codec?: string;
  selected?: boolean;
}

interface TextTrack {
  kind: string;
  label: string;
  language: string;
  id?: string;
  mode?: string;
}

const MediaPlayerSettings = forwardRef<HTMLButtonElement, MediaPlayerSettingsProps>(
  ({ asChild, speeds = SPEEDS, className, children, ...props }, forwardedRef) => {
    const { store, rootRef } = useMediaPlayerContext(SETTINGS_NAME);
    const mediaPlaybackRate = useMediaSelector((state) => state.mediaPlaybackRate);
    const mediaRenditionList = useMediaSelector((state) => state.mediaRenditionList) as
      | Rendition[]
      | undefined;
    const mediaRenditionSelected = useMediaSelector((state) => state.mediaRenditionSelected) as
      | string
      | undefined;
    const mediaSubtitlesList = useMediaSelector((state) => state.mediaSubtitlesList) as
      | TextTrack[]
      | undefined;
    const mediaSubtitlesShowing = useMediaSelector((state) => state.mediaSubtitlesShowing) as
      | TextTrack[]
      | undefined;
    const dispatch = useMediaDispatch();

    const currentSpeed = mediaPlaybackRate ?? 1;
    const hasRenditions = Boolean(mediaRenditionList && mediaRenditionList.length > 0);
    const hasSubtitles = Boolean(mediaSubtitlesList && mediaSubtitlesList.length > 0);
    const currentSubtitle = mediaSubtitlesShowing?.[0];

    const handleSpeedChange = useCallback(
      (speed: number) => {
        dispatch({
          type: MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST,
          detail: speed,
        });
      },
      [dispatch]
    );

    const handleRenditionChange = useCallback(
      (renditionId: string | undefined) => {
        dispatch({
          type: MediaActionTypes.MEDIA_RENDITION_REQUEST,
          detail: renditionId,
        });
      },
      [dispatch]
    );

    const handleSubtitleChange = useCallback(
      (track: TextTrack | null) => {
        if (track === null) {
          dispatch({ type: MediaActionTypes.MEDIA_DISABLE_SUBTITLES_REQUEST });
        } else {
          dispatch({
            type: MediaActionTypes.MEDIA_SHOW_SUBTITLES_REQUEST,
            detail: track,
          });
        }
      },
      [dispatch]
    );

    const handleOpenChange = useCallback(
      (open: boolean) => {
        store.setState({ menuOpen: open });
      },
      [store]
    );

    const formatResolution = (rendition: Rendition) => {
      if (rendition.height) {
        return `${rendition.height}p`;
      }
      return rendition.id || "Unknown";
    };

    const Comp = asChild ? Slot : Button;

    return (
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Comp
            ref={forwardedRef}
            data-slot="media-player-settings"
            variant="ghost"
            size="icon-sm"
            className={cn("text-white hover:bg-white/25 hover:text-white", className)}
            aria-label="Settings"
            {...props}
          >
            {children ?? <SettingsIcon {...sharpIconProps} className="size-5 drop-shadow-md" />}
          </Comp>
        </DropdownMenuTrigger>
        <DropdownMenuContent container={rootRef.current} sideOffset={FLOATING_MENU_SIDE_OFFSET}>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Playback Speed</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {speeds.map((speed) => (
                <DropdownMenuItem key={speed} onClick={() => handleSpeedChange(speed)}>
                  <span className="flex-1">{speed}x</span>
                  {currentSpeed === speed && <CheckIcon {...sharpIconProps} className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {hasRenditions && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Quality</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleRenditionChange(undefined)}>
                  <span className="flex-1">Auto</span>
                  {!mediaRenditionSelected && <CheckIcon {...sharpIconProps} className="size-4" />}
                </DropdownMenuItem>
                {mediaRenditionList?.map((rendition, index) => {
                  const renditionId = rendition.id || String(index);
                  const isSelected = mediaRenditionSelected === renditionId;
                  return (
                    <DropdownMenuItem
                      key={renditionId}
                      onClick={() => handleRenditionChange(renditionId)}
                    >
                      <span className="flex-1">{formatResolution(rendition)}</span>
                      {isSelected && <CheckIcon {...sharpIconProps} className="size-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          {hasSubtitles && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Captions</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleSubtitleChange(null)}>
                  <span className="flex-1">Off</span>
                  {!currentSubtitle && <CheckIcon {...sharpIconProps} className="size-4" />}
                </DropdownMenuItem>
                {mediaSubtitlesList?.map((track, index) => {
                  const isSelected = currentSubtitle?.language === track.language;
                  return (
                    <DropdownMenuItem
                      key={track.language || String(index)}
                      onClick={() => handleSubtitleChange(track)}
                    >
                      <span className="flex-1">{track.label || track.language}</span>
                      {isSelected && <CheckIcon {...sharpIconProps} className="size-4" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
MediaPlayerSettings.displayName = SETTINGS_NAME;

interface Chapter {
  startTime: number;
  endTime: number;
  title: string;
}

interface MediaPlayerChaptersProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
  chapters: Chapter[];
  variant?: "list" | "compact";
}

const MediaPlayerChapters = forwardRef<HTMLDivElement, MediaPlayerChaptersProps>(
  ({ asChild, chapters, variant = "list", className, ...props }, forwardedRef) => {
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);
    const dispatch = useMediaDispatch();

    const currentTime = mediaCurrentTime ?? 0;

    const formatTime = (time: number) => {
      if (!Number.isFinite(time) || time < 0) return "0:00";
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = Math.floor(time % 60);

      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleChapterClick = useCallback(
      (startTime: number) => {
        dispatch({
          type: MediaActionTypes.MEDIA_SEEK_REQUEST,
          detail: startTime,
        });
      },
      [dispatch]
    );

    const currentChapterIndex = chapters.findIndex(
      (chapter) => currentTime >= chapter.startTime && currentTime < chapter.endTime
    );

    const Comp = asChild ? Slot : "div";

    if (variant === "compact") {
      const currentChapter = currentChapterIndex >= 0 ? chapters[currentChapterIndex] : null;
      return (
        <Comp
          ref={forwardedRef}
          data-slot="media-player-chapters"
          className={cn("text-xs text-white/80", className)}
          {...props}
        >
          {currentChapter?.title ?? "—"}
        </Comp>
      );
    }

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-chapters"
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        {chapters.map((chapter, index) => {
          const isActive = index === currentChapterIndex;
          const progress =
            isActive && chapter.endTime > chapter.startTime
              ? ((currentTime - chapter.startTime) / (chapter.endTime - chapter.startTime)) * 100
              : index < currentChapterIndex
                ? 100
                : 0;

          return (
            <button
              key={index}
              type="button"
              data-slot="media-player-chapter"
              data-active={isActive}
              onClick={() => handleChapterClick(chapter.startTime)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 text-left transition-colors",
                isActive ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <span
                data-slot="media-player-chapter-time"
                className="text-xs tabular-nums text-white/50 group-hover:text-white/70"
              >
                {formatTime(chapter.startTime)}
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-medium">{chapter.title}</span>
                <div
                  data-slot="media-player-chapter-progress"
                  className="bg-white/20 h-0.5 w-full overflow-hidden"
                >
                  <div
                    data-slot="media-player-chapter-progress-fill"
                    className="bg-white h-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </Comp>
    );
  }
);
MediaPlayerChapters.displayName = "MediaPlayerChapters";

interface MediaPlayerCurrentChapterProps extends React.ComponentPropsWithoutRef<"span"> {
  asChild?: boolean;
  chapters: Chapter[];
}

const MediaPlayerCurrentChapter = forwardRef<HTMLSpanElement, MediaPlayerCurrentChapterProps>(
  ({ asChild, chapters, className, ...props }, forwardedRef) => {
    const mediaCurrentTime = useMediaSelector((state) => state.mediaCurrentTime);

    const currentTime = mediaCurrentTime ?? 0;

    const currentChapter = chapters.find(
      (chapter) => currentTime >= chapter.startTime && currentTime < chapter.endTime
    );

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={forwardedRef}
        data-slot="media-player-current-chapter"
        className={cn("truncate text-xs text-white/80", className)}
        {...props}
      >
        {currentChapter?.title ?? ""}
      </Comp>
    );
  }
);
MediaPlayerCurrentChapter.displayName = "MediaPlayerCurrentChapter";

interface MdxMediaPlayerProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  src: string;
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  preload?: React.ComponentPropsWithoutRef<"video">["preload"];
  children?: React.ReactNode;
}

const MdxMediaPlayer = ({
  src,
  title,
  poster,
  autoPlay,
  loop,
  muted,
  preload,
  className,
  children,
  ...props
}: MdxMediaPlayerProps) => {
  const getYouTubeEmbedInfo = useCallback((mediaSrc: string): YouTubeEmbedInfo | null => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(mediaSrc);
    } catch {
      return null;
    }

    const host = parsedUrl.hostname.replace(/^www\./, "");
    const isYouTubeHost =
      host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be";
    if (!isYouTubeHost) return null;

    const getIdFromPath = (path: string) => {
      const parts = path.split("/").filter(Boolean);
      const firstPart = parts[0];
      const secondPart = parts[1];
      if (firstPart === "embed" && typeof secondPart === "string" && secondPart.length > 0) {
        return secondPart;
      }
      if (firstPart === "shorts" && typeof secondPart === "string" && secondPart.length > 0) {
        return secondPart;
      }
      return null;
    };

    const videoId =
      host === "youtu.be"
        ? parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null
        : parsedUrl.searchParams.get("v") ?? getIdFromPath(parsedUrl.pathname);

    if (!videoId) return null;

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return { embedUrl };
  }, []);

  const youTubeEmbedInfo = useMemo(() => getYouTubeEmbedInfo(src), [getYouTubeEmbedInfo, src]);

  if (youTubeEmbedInfo) {
    return (
      <div
        className={cn("my-6 border border-border/40 bg-background text-foreground overflow-hidden", className)}
        aria-label={title ?? "YouTube video"}
        {...props}
      >
        <div className="relative aspect-video w-full bg-black">
          <iframe
            title={title ?? "YouTube video"}
            src={youTubeEmbedInfo.embedUrl}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <MediaPlayer
      className={cn(
        "my-6 border border-border/40 bg-background text-foreground overflow-hidden fullscreen:my-0 fullscreen:border-0 fullscreen:bg-black fullscreen:text-white",
        className
      )}
      aria-label={title ?? "Media player"}
      {...props}
    >
      <div className="relative">
        <MediaPlayerVideo
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          className="bg-black"
        >
          {children}
        </MediaPlayerVideo>

        <MediaPlayerLoading />
        <MediaPlayerError />
        <MediaPlayerVolumeIndicator />
        <MediaPlayerControlsOverlay />
        <MediaPlayerControls className="gap-2">
          <MediaPlayerPlay />
          <MediaPlayerSeek className="mx-1" />
          <MediaPlayerTime className="whitespace-nowrap" />
          <MediaPlayerMute />
          <MediaPlayerPiP />
          <MediaPlayerFullscreen />
        </MediaPlayerControls>
      </div>
    </MediaPlayer>
  );
};

export {
  MediaPlayer,
  MediaPlayerVideo,
  MediaPlayerAudio,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerLoading,
  MediaPlayerError,
  MediaPlayerVolumeIndicator,
  MediaPlayerPlay,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerSeek,
  MediaPlayerVolume,
  MediaPlayerMute,
  MediaPlayerTime,
  MediaPlayerPlaybackSpeed,
  MediaPlayerLoop,
  MediaPlayerFullscreen,
  MediaPlayerPiP,
  MediaPlayerCaptions,
  MediaPlayerDownload,
  MediaPlayerSettings,
  MediaPlayerChapters,
  MediaPlayerCurrentChapter,
  MdxMediaPlayer,
};

export type { Chapter, Storyboard };


