package com.chasewhiterabbit.rigger.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.chasewhiterabbit.rigger.core.ui.theme.ThemeRole

@Composable
fun GradientButton(
    onClick: () -> Unit,
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    role: ThemeRole = ThemeRole.HERO,
    contentPadding: PaddingValues = ButtonDefaults.ContentPadding
) {
    val colorScheme = MaterialTheme.colorScheme
    
    val gradientColors = when (role) {
        ThemeRole.HERO -> listOf(
            colorScheme.primary,
            colorScheme.primaryContainer
        )
        ThemeRole.MYSTIC -> listOf(
            colorScheme.secondary,
            colorScheme.secondaryContainer
        )
    }

    Button(
        onClick = onClick,
        modifier = modifier
            .background(
                Brush.horizontalGradient(gradientColors),
                shape = MaterialTheme.shapes.medium
            ),
        enabled = enabled,
        contentPadding = contentPadding,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            contentColor = colorScheme.onPrimary
        )
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelLarge
        )
    }
}
