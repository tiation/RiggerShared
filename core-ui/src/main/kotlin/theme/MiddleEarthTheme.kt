package com.chasewhiterabbit.rigger.core.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.graphics.Color

// Hero Red Palette - inspired by the fires of Mount Doom
private val HeroRed = Color(0xFFD32F2F) // Primary
private val HeroRedLight = Color(0xFFFF6659)
private val HeroRedDark = Color(0xFF9A0007)

// Mystic Purple Palette - inspired by Gandalf's magic
private val MysticPurple = Color(0xFF673AB7) // Primary  
private val MysticPurpleLight = Color(0xFF9A67EA)
private val MysticPurpleDark = Color(0xFF320B86)

// Neutral Earth Tones - inspired by the Shire
private val EarthBrown = Color(0xFF795548)
private val EarthTan = Color(0xFFBCAAA4)
private val EarthGray = Color(0xFF757575)

// Light Theme Colors
private val LightColorScheme = lightColorScheme(
    primary = HeroRed,
    onPrimary = Color.White,
    primaryContainer = HeroRedLight,
    onPrimaryContainer = Color(0xFF410002),
    secondary = MysticPurple,
    onSecondary = Color.White,
    secondaryContainer = MysticPurpleLight,
    onSecondaryContainer = Color(0xFF21005E),
    tertiary = EarthBrown,
    onTertiary = Color.White,
    tertiaryContainer = EarthTan,
    onTertiaryContainer = Color(0xFF3E2723),
    background = Color(0xFFFFFBFE),
    onBackground = Color(0xFF1C1B1F),
    surface = Color(0xFFFFFBFE),
    onSurface = Color(0xFF1C1B1F),
    surfaceVariant = Color(0xFFE7E0EC),
    onSurfaceVariant = Color(0xFF49454F),
    error = Color(0xFFB3261E),
    onError = Color.White
)

// Dark Theme Colors
private val DarkColorScheme = darkColorScheme(
    primary = HeroRedDark,
    onPrimary = Color.White,
    primaryContainer = HeroRed,
    onPrimaryContainer = Color(0xFFFFDAD6),
    secondary = MysticPurpleDark,
    onSecondary = Color.White,
    secondaryContainer = MysticPurple,
    onSecondaryContainer = Color(0xFFEADDFF),
    tertiary = EarthTan,
    onTertiary = Color.White,
    tertiaryContainer = EarthBrown,
    onTertiaryContainer = Color(0xFFFFDBCF),
    background = Color(0xFF1C1B1F),
    onBackground = Color(0xFFE6E1E5),
    surface = Color(0xFF1C1B1F),
    onSurface = Color(0xFFE6E1E5),
    surfaceVariant = Color(0xFF49454F),
    onSurfaceVariant = Color(0xFFCAC4D0),
    error = Color(0xFFF2B8B5),
    onError = Color(0xFF601410)
)

enum class ThemeRole {
    HERO,    // Uses HeroRed as primary
    MYSTIC   // Uses MysticPurple as primary
}

@Composable
fun MiddleEarthTheme(
    role: ThemeRole = ThemeRole.HERO,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    // Adjust primary colors based on role
    val adjustedColorScheme = when (role) {
        ThemeRole.HERO -> colorScheme
        ThemeRole.MYSTIC -> colorScheme.copy(
            primary = if (darkTheme) MysticPurpleDark else MysticPurple,
            primaryContainer = if (darkTheme) MysticPurple else MysticPurpleLight
        )
    }

    MaterialTheme(
        colorScheme = adjustedColorScheme,
        typography = MiddleEarthTypography,
        shapes = Shapes,
        content = content
    )
}
